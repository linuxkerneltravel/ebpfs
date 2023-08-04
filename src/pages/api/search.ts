import type {NextApiRequest, NextApiResponse} from 'next'
import SearchService from "@/services/search";
import Message from "@/common/message";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'GET') {
        const {query} = req.query;

        if (!query) {
            res.status(400).json(new Message(400, 'Query is not set', null));
            return;
        }
        if (typeof query !== 'string') {
            res.status(400).json(new Message(400, 'Query is not string', null));
            return;
        }

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
        const result = await search.search(query);

        res.status(200).json(new Message(200, 'OK', result.hits));
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}