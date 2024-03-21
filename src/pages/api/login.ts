import type {NextApiRequest, NextApiResponse} from 'next'
import DatabaseService from "@/services/database"
import CacheService from "@/services/cache"
import {Token, TokenType} from "@/common/token"
import {Account, AccountType} from "@/common/account"
import {AccountTable} from "@/data/account"
import EmailService from "@/services/mail"
import Message from "@/common/message";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message<any>>) {
    if (req.method as string !== 'GET' || req.method !== 'POST') {
        res.status(400).json({status: 400, message: 'request method not match.', data: null})
        return
    }

    if (req.method as string === 'GET') {
        const {code, state} = req.query;

        if (code === null || code === '') {
            res.status(400).json({status: 400, message: 'code is invalid.', data: null});
            return;
        }

        if (state === null || state === '') {
            res.status(400).json({status: 400, message: 'state is invalid.', data: null});
            return;
        }

        const githubClientID = process.env.GITHUB_OAUTH_CLIENT_ID
        const githubClientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET
        const tokens = new CacheService<Token>()
        const accounts = new DatabaseService<Account>()

        // 请求 GitHub API 获取用户信息
        const tokenRes = await fetch(
            `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${code}&state=${state}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                }
            }
        )

        const tokenResJson = await tokenRes.json()
        const {access_token} = tokenResJson

        const userRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            }
        })

        const userResJson = await userRes.json()
        const {avatar_url, id, name} = userResJson

        // 检查如果三个参数中有一个不为空则正常执行
        if (
            avatar_url === null || avatar_url === '' ||
            id === null || id === '' ||
            name === null || name === ''
        ) {
            res.status(400).json({status: 400, message: 'invalid response.', data: null})
            return
        }

        // 检查表
        await accounts.autoMigrate()

        // 检查用户是否已经记录过
        const accountInDB = await accounts.readAccount(id, AccountType.GITHUB)

        // 如果数据库中没有则创建
        const account = new Account(
            crypto.randomUUID(),
            id,
            name,
            avatar_url,
            null,
            null,
            AccountType.GITHUB,
            new Date().getTime()
        )

        if (!account.openid) {
            res.status(400).json({status: 400, message: 'invalid response.', data: null});
            return
        }

        // FIXME: 这里逻辑有点奇怪 为什么要提前创建 Account 呢？ 目前还需亚多判断一个 openid 是否存在
        accountInDB.length === 0
            ? await accounts.createAccount(account)
            : await accounts.updateAccount(account.openid, account)


        // 无论如何都返回用户信息和有效 Token
        const time = new Date().getTime()
        const expire = new Date(time + 60 * 60 * 1000).getTime()

        const token: Token = {
            token: crypto.randomUUID(),
            belong: accountInDB.length === 0 ? account.id : accountInDB[0].id,
            type: TokenType.OAUTH_TOKEN,
            created: time,
            expire: expire
        }

        await tokens.set(token.token, token)

        // FIXME: 特别是这个 account 账号字段 三元太别扭了
        res.status(200).json(
            {
                status: 200,
                message: 'success',
                data: {
                    account: accountInDB.length === 0 ? account : accountInDB[0],
                    token: token,
                    origin: userResJson
                }
            }
        )

        return
    }

    if (req.method === 'POST') {
        const header = req.headers['authorization']
        const {email, password, code} = req.body

        const tokens = new CacheService<Token>()
        const token = header ? await tokens.get(header as string) as Token : null

        // 使用不同参数进行不同的操作
        // email password 为登录
        // token email 和 password 为修改密码

        // FIXME: 什么三层嵌套 一定记得回头改 uwu
        if (email && password) {
            if (token) {
                // 修改密码
                const accounts = new DatabaseService<Account>()
                // 检查表
                await accounts.autoMigrate();
                const account = await accounts.readAccount(token.belong, AccountType.EMAIL)

                if (account.length === 0) {
                    res.status(400).json({status: 400, message: 'account not found.', data: null})
                    return
                }

                // 修改密码
                account[0].password = AccountTable.getPassword(password as string)

                await accounts.updateAccount(account[0].id, account[0])
                res.status(200).json({status: 200, message: 'success', data: null})
                return;
            }

            // 普通登录
            // 检查用户是否存在
            const accounts = new DatabaseService<Account>()
            // 检查表
            await accounts.autoMigrate();
            const account = await accounts.readAccount(email as string, AccountType.EMAIL)

            // 账号不存在
            if (account.length === 0) {
                // 发送注册邮件
                const sender = new EmailService()
                const verifyCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')

                // 发送邮件
                await sender.send(email, 'Verify your email address', `Your verification code is ${verifyCode}.`)

                // 存入 Token
                const tokens = new CacheService<Token>();
                await tokens.set(
                    verifyCode,
                    {
                        token: verifyCode,
                        belong: email,
                        type: TokenType.EMAIL_VERIFY_CODE,
                        created: Date.now(),
                        expire: Date.now() + 1000 * 60 * 10
                    }
                )

                // 跳转到验证页面
                res.status(200).json({
                    status: 302,
                    message: 'redirect to verify page.',
                    data: `/verify?email=${email}&password=${password}`
                })
                return
            }

            // 检查密码是否正确
            if (!AccountTable.checkPassword(account[0].password as string, password as string)) {
                res.status(400).json({status: 400, message: 'password is incorrect.', data: null})
                return
            }

            // 创建 Token
            const t: Token = {
                token: crypto.randomUUID(),
                belong: account[0].id,
                type: TokenType.ACCOUNT_API_KEY,
                created: new Date().getTime(),
                expire: new Date(new Date().getTime() + 60 * 60 * 1000).getTime()
            }

            await tokens.set(t.token, t)
            res.status(200).json({status: 200, message: 'success', data: {account: account[0], token: t}})

            return
        }
    }
}