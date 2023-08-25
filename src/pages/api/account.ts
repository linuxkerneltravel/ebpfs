import type {NextApiRequest, NextApiResponse} from 'next'
import Message from "@/common/message";
import CacheService from "@/services/cache";
import {Token} from "@/common/token";
import DatabaseService from "@/services/database";
import {Repository} from "@/common/repository";
import {Account} from "@/common/account";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'GET') {
        // 查询 Token
        const header = req.headers['authorization'];

        if (header === undefined || header === null) {
            res.status(400).json(new Message(400, 'token is invalid.', null));
            return;
        }

        const tokens = new CacheService<Token>();
        const token = await tokens.get(header as string) as Token;

        // 查询账号信息
        const accounts = new DatabaseService<Account>();
        const id = token.belong;
        const account = await accounts.readAccountById(id);

        // 查询仓库列表
        const repositories = new DatabaseService<Repository>();
        const repos = await repositories.readRepositoryByAccount(id);

        res.status(200).json(new Message(200, 'success.',
            {
                id: id,
                account: account.length !== 0 ? account[0] : {},
                repositories: repos
            }));
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}