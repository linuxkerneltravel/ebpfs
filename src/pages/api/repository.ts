import type {NextApiRequest, NextApiResponse} from 'next'
import Message from "@/common/message";
import CacheService from "@/services/cache";
import {Token} from "@/common/token";
import {Repository} from "@/common/repository";
import DatabaseService from "@/services/database";
import SearchService from "@/services/search";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'GET') {
        const {id} = req.query;

        if (id === null || id === '') {
            res.status(400).json(new Message(400, 'repository is invalid.', null));
            return;
        }

        const repositories = new DatabaseService();
        const repo = await repositories.readRepository(id as string);

        res.status(200).json(new Message(200, 'OK', {
            repository: repo
        }));
    } else if (req.method === 'POST') {
        // 根据 Token 获取账号 ID
        const header = req.headers['authorization'];

        if (header === undefined || header === null) {
            res.status(400).json(new Message(400, 'token is invalid.', null));
            return;
        }

        const tokens = new CacheService<Token>();
        const repositories = new DatabaseService();

        const token = await tokens.get(header as string) as Token;

        if (token === undefined || token === null) {
            res.status(400).json(new Message(400, 'token is invalid.', null));
            return;
        }

        // 解构 form-data
        const {
            update, organization, project,
            version, readme, type, repository,
            entry, author, tags
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
            tags
        )

        await repositories.createRepository(repo);

        const algoliaApplicationID = process.env.ALGOLIA_APPLICATION_ID;
        const algoliaAPIKey = process.env.ALGOLIA_API_KEY;

        if (!algoliaApplicationID) {
            res.status(500).json(new Message(500, 'ALGOLIA_APPLICATION_ID is not set', null));
            return;
        }

        if (!algoliaAPIKey) {
            res.status(500).json(new Message(500, 'ALGOLIA_API_KEY is not set', null));
            return;
        }

        const search = new SearchService(algoliaApplicationID, algoliaAPIKey);

        const content = await fetch(repo.readme).then(async (response) => response.text());

        await search.upload({
            id: repo.id,
            url: repo.repository,
            organization: repo.organization,
            project: repo.project,
            readme: content,
            author: repo.author,
            tags: repo.tags
        });

        res.status(200).json(new Message(200, 'OK', repo));
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}