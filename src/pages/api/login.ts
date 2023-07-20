import type {NextApiRequest, NextApiResponse} from 'next'
import Message from "@/common/message";
import DatabaseService from "@/services/database";
import CacheService from "@/services/cache";
import {Token} from "@/common/token";
import {Account} from "@/common/account";

export default function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    const githubClientID = process.env.GITHUB_CLIENT_ID;

    if (req.method === 'GET') {
        const state = Math.random().toString(16).substr(2);
        const baseUrl = process.env.BASE_URL;

        // 跳转
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientID}&state=${state}&redirect_uri=${baseUrl}/login`);
    }

    if (req.method !== 'POST') {
        const {code} = req.query;

        if (code === null || code === '') {
            res.status(400).json(new Message(400, 'code is invalid.', null));
            return;
        }

        const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
        const tokens = new CacheService<Token>();
        const accounts = new DatabaseService<Account>();

        // 检查用户是否已经记录过
        // 如果数据库中没有则创建
        // 如果数据库中有则更新
        // 无论如何都返回用户信息和有效 Token
    }

    res.status(400).json(new Message(400, 'request method not match.', null));
}