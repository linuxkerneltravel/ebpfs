import {NextApiRequest, NextApiResponse} from "next";
import Message from "@/common/message";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'GET') {
        // 从 algolia 中获取数据
        // 搜索词
        // 搜索量最多的 10 个仓库
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}