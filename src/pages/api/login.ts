import type {NextApiRequest, NextApiResponse} from 'next'
import Message from "@/common/message";
import DatabaseService from "@/services/database";
import CacheService from "@/services/cache";
import {Token, TokenType} from "@/common/token";
import {Account, AccountType} from "@/common/account";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'GET') {
        const {code, state} = req.query;

        if (code === null || code === '') {
            res.status(400).json(new Message(400, 'code is invalid.', null));
            return;
        }

        if (state === null || state === '') {
            res.status(400).json(new Message(400, 'state is invalid.', null));
            return;
        }

        const githubClientID = process.env.GITHUB_OAUTH_CLIENT_ID;
        const githubClientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
        const tokens = new CacheService<Token>();
        const accounts = new DatabaseService<Account>();

        // 请求 GitHub API 获取用户信息
        const tokenRes = await fetch(`https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${code}&state=${state}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            }
        });

        const tokenResJson = await tokenRes.json();
        const {access_token} = tokenResJson;

        const userRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            }
        });

        const userResJson = await userRes.json();
        const {avatar_url, id, name} = userResJson;

        // 检查如果三个参数中有一个不为空则正常执行
        if (
            avatar_url === null || avatar_url === '' ||
            id === null || id === '' ||
            name === null || name === ''
        ) {
            res.status(400).json(new Message(400, 'invalid response.', null));
            return;
        }

        // 检查表
        await accounts.autoMigrate();

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
        );

        if (!account.openid) {
            res.status(400).json(new Message(400, 'invalid response.', null));
            return;
        }

        // 检查用户是否已经记录过
        const accountInDB = await accounts.readAccount(account.openid, AccountType.GITHUB);

        accountInDB.length === 0
            ? await accounts.createAccount(account)
            : await accounts.updateAccount(account.openid, account);

        // 无论如何都返回用户信息和有效 Token
        const time = new Date().getTime();
        const expire = new Date(time + 60 * 60 * 1000).getTime();

        const token = new Token(
            crypto.randomUUID(),
            account.id,
            TokenType.OAUTH_TOKEN,
            time,
            expire
        );

        await tokens.set(token.token, token);

        res.status(200).json(new Message(200, 'success', {account: account, token: token, origin: userResJson}));
    } else if (req.method === 'POST') {
        const header = req.headers['authorization'];
        const {email, password, code} = req.body;

        const tokens = new CacheService<Token>();
        const token = await tokens.get(header as string) as Token;

        // 使用不同参数进行不同的操作
        // email password 为登录
        // email code password 为注册后登录
        // token email 和 password 为修改密码

        // FIXME: 什么三层嵌套 一定记得回头改 uwu
        if (email && password) {
            if (code && !token) {
                // 获取验证码
                const verify = await tokens.get(code as string) as Token;

                if (verify) {

                }
            }

            if (token && !code) {

            }
        }
    } else {
        res.status(400).json(new Message(400, 'request method not match.', null));
    }
}