import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";
import {Account} from "@/common/account";
import {Repository} from "@/common/repository";
import {useState} from "react";
import Message from "@/common/message";

const inter = Inter({subsets: ['latin']})

interface Response {
    id: string;
    account: Account;
    repositories: Repository[];
}

export default function AccountPage() {
    function getGithubAuthorizeUrl() {
        const githubClientID = process.env.GITHUB_OAUTH_CLIENT_ID;
        const state = crypto.randomUUID();
        const baseUrl = process.env.BASE_URL;

        return `https://github.com/login/oauth/authorize?client_id=${githubClientID}&state=${state}&redirect_uri=${baseUrl}/login`;
    }

    const token = State.token;
    // 不要在任意 return 后使用 useState，因为这会导致每次渲染都会重置 state
    const [result, setResult] = useState<Response>();

    if (!State.isLogin()) {
        return (
            <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
                  className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
                <Navbar/>
                <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                    <div className="mt-2">
                        <Button icon="icons8-github.svg" text="使用 Github 登录"
                                onclick={() => window.location.href = getGithubAuthorizeUrl()}/>
                    </div>
                </div>
            </main>
        )
    }

    // 获取账号信息的逻辑
    fetch('/api/account')
        .then(result => result.json() as Promise<Message<Response>>)
        .then(data => setResult(data.data));

    // 新建仓库的逻辑

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">

            </div>
        </main>
    )
}
