import {NextApiRequest, NextApiResponse} from "next"
import Message from "@/common/message";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message<any>>) {
    if (req.method !== 'GET') {
        res.status(400).json({status: 400, message: 'request method not match.', data: null})
        return
    }

    res.status(200).json({status: 200, message: 'OK', data: null})
}