import type {NextApiRequest, NextApiResponse} from 'next'
import Message from "@/common/message";
import CacheService from "@/services/cache";
import {Token} from "@/common/token";
import {Repository} from "@/common/repository";
import DatabaseService from "@/services/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'POST') {
        // 根据 Token 获取账号 ID
        const header = req.headers['Authorization'];

        if (header === undefined || header === null) {
            res.status(400).json(new Message(400, 'token is invalid.', null));
            return;
        }

        const tokens = new CacheService<Token>();
        const repositories = new DatabaseService();
        const token = tokens.get(header as string) as Token;

        // 解构 form-data
        const {
            update, organization, project,
            version, readme, type, repository,
            entry, author, keywords, tags
        }: Repository = req.body;

        const repo = new Repository(
            crypto.randomUUID(),
            token.belong,
            new Date().getTime().toString(),
            update,
            organization,
            project,
            version,
            readme,
            type,
            repository,
            entry,
            author,
            keywords,
            tags
        )

        await repositories.createRepository(repo);

        res.status(200).json({})
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}