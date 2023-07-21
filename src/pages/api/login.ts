import type {NextApiRequest, NextApiResponse} from 'next'
import Message from "@/common/message";
import DatabaseService from "@/services/database";
import CacheService from "@/services/cache";
import {ExpireTime, Token, TokenType} from "@/common/token";
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

        // 检查用户是否已经记录过
        // 如果数据库中没有则创建
        const account = new Account(
            crypto.randomUUID(),
            id,
            name,
            avatar_url,
            AccountType.GITHUB,
            new Date().getTime()
        );

        // 如果数据库中有则更新
        // 无论如何都返回用户信息和有效 Token
        const time = new Date().getTime();
        const token = new Token(
            crypto.randomUUID(),
            account.id,
            TokenType.OAUTH_TOKEN,
            time,
            time + ExpireTime.MINUTE * 30
        );

        res.status(200).json(new Message(200, 'success', {account: account, token: token}));
    } else {
        res.status(400).json(new Message(400, 'request method not match.', null));
    }
}