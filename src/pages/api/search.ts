import type {NextApiRequest, NextApiResponse} from 'next'
import SearchService from "@/services/search"
import Message from "@/common/message"

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message<any>>) {
    if (req.method !== 'GET') {
        res.status(400).json({status: 400, message: 'request method not match.', data: null})
        return
    }

    const {query} = req.query;

    if (!query) {
        res.status(400).json({status: 400, message: 'Query is not set', data: null})
        return
    }
    if (typeof query !== 'string') {
        res.status(400).json({status: 400, message: 'Query is not string', data: null})
        return
    }

    const search = new SearchService()
    const result = await search.search(query)

    res.status(200).json({status: 200, message: 'OK', data: result.hits})
}