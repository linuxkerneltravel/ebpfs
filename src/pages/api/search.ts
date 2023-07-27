import type {NextApiRequest, NextApiResponse} from 'next'
import SearchService from "@/services/search";
import Message from "@/common/message";

export default function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method !== 'GET') {
        const {query} = req.query;

        if (!query) {
            res.status(400).json({error: 'Query is empty'});
            return;
        }
        if (typeof query !== 'string') {
            res.status(400).json({error: 'Query is not a string'});
            return;
        }

        const algoliaApplicationID = process.env.ALGOLIA_APPLICATION_ID;
        const algoliaAPIKey = process.env.ALGOLIA_API_KEY;

        if (!algoliaApplicationID) {
            res.status(500).json({error: 'ALGOLIA_APPLICATION_ID is not set'});
            return;
        }

        if (!algoliaAPIKey) {
            res.status(500).json({error: 'ALGOLIA_API_KEY is not set'});
            return;
        }

        const search = new SearchService(algoliaApplicationID, algoliaAPIKey);

        res.status(200).json(new Message(200, 'OK', search.search(query)));
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}