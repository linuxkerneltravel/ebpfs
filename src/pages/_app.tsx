import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {Token} from "@/common/token";
import {Account} from "@/common/account";

export class State {
    public static token: Token | null = null;
    public static account: Account | null = null;

    public static isLogin(): boolean {
        return State.token !== null;
    }

    public static getGithubAuthorizeUrl() {
        const githubClientID = process.env.GITHUB_OAUTH_CLIENT_ID;
        const state = crypto.randomUUID();
        const baseUrl = process.env.BASE_URL;

        return `https://github.com/login/oauth/authorize?client_id=${githubClientID}&state=${state}&redirect_uri=${baseUrl}/api/login`;
    }
}

export default function App({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />
}