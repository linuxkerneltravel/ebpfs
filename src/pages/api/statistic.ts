import {NextApiRequest, NextApiResponse} from "next";
import Message from "@/common/message";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'GET') {
        res.status(200).json(new Message(200, 'OK', null));
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}