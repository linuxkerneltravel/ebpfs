import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    const githubClientID = process.env.GITHUB_OAUTH_CLIENT_ID;
    const state = crypto.randomUUID();
    const baseUrl = process.env.BASE_URL;

    res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientID}&state=${state}&redirect_uri=${baseUrl}/login`);
}