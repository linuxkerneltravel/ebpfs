import {NextApiRequest, NextApiResponse} from "next";
import Message from "@/common/message"
import CacheService from "@/services/cache"
import {Token, TokenType} from "@/common/token"
import {Account, AccountType} from "@/common/account"
import DatabaseService from "@/services/database"
import {AccountTable} from "@/data/account"

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message<any>>) {
    if (req.method === 'GET') {
        const {email, password, code} = req.query

        const tokens = new CacheService<Token>()
        const token = await tokens.get(code as string)

        if (!token) {
            res.status(400).json({status: 400, message: 'token expired.', data: null})
            return
        }

        if (token.belong !== email) {
            res.status(400).json({status: 400, message: 'invalid token.', data: null})
            return
        }

        if (token.token !== code) {
            res.status(400).json({status: 400, message: 'invalid code.', data: null})
            return
        }

        // 修改密码
        const accounts = new DatabaseService<Account>()
        // 检查表
        await accounts.autoMigrate()
        // 创建用户
        const account = new Account(
            crypto.randomUUID(),
            null,
            // 截断邮箱 @ 前面的部分作为昵称
            email.toString().split('@')[0],
            "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            AccountTable.getPassword(password as string),
            email,
            AccountType.EMAIL,
            new Date().getTime()
        )

        await accounts.createAccount(account)

        const time = new Date().getTime()
        const expire = new Date(time + 60 * 60 * 1000).getTime()
        const t: Token = {
            token: crypto.randomUUID(),
            belong: account.id,
            type: TokenType.ACCOUNT_API_KEY,
            created: time,
            expire: expire
        }

        await tokens.set(t.token, t)

        res.status(200).json({status: 200, message: 'success', data: {account: account, token: t}})
    } else res.status(400).json({status: 400, message: 'request method not match.', data: null})
}