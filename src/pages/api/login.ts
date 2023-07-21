import type {NextApiRequest, NextApiResponse} from 'next'
import Message from "@/common/message";
import DatabaseService from "@/services/database";
import CacheService from "@/services/cache";
import {ExpireTime, Token, TokenType} from "@/common/token";
import {Account, AccountType} from "@/common/account";

export default function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
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
        fetch(`https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${code}&state=${state}`)
            .then(r => {
                return fetch('https://api.github.com/user', {
                    headers: {
                        // @ts-ignore
                        Authorization: `Bearer ${r.json().access_token}`
                    }
                });
            })
            .then(r => {
                // @ts-ignore
                const {avatar_url, id, name} = r.json();

                // 检查用户是否已经记录过
                // 如果数据库中没有则创建
                const account = new Account(
                    Math.random().toString(16).substr(2),
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
                    Math.random().toString(16).substr(2),
                    account.id,
                    TokenType.OAUTH_TOKEN,
                    time,
                    time + ExpireTime.MINUTE * 30
                );

                res.status(200).json(new Message(200, 'success', {account: account, token: token}));
            })
            .catch(err => {
                res.status(500).json(new Message(500, 'request github api failed.', err));
            });
    } else {
        res.status(400).json(new Message(400, 'request method not match.', null));
    }
}