import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";
import {Account} from "@/common/account";
import {Repository} from "@/common/repository";
import {useEffect, useState} from "react";
import Message from "@/common/message";

const inter = Inter({subsets: ['latin']})

interface Response {
    id: string;
    account: Account;
    repositories: Repository[];
}

export default function AccountPage() {
    const token = State.token?.token;
    // 不要在任意 return 后使用 useState，因为这会导致每次渲染都会重置 state
    const [result, setResult] = useState<Response>();

    useEffect(() => {
        // 获取账号信息的逻辑
        // 这里的 Token 在 isLogin 校验中判定为非空 那么这里一定不为空
        fetch('/api/account', {headers: {Authorization: token as string}})
            .then(result => result.json() as Promise<Message<Response>>)
            .then(data => setResult(data.data));
    }, []);

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                {
                    result
                        ? <div></div>
                        : <div className="mt-2">
                            <Button icon="icons8-github.svg" text="使用 Github 登录" href="/api/oauth"/>
                        </div>
                }
            </div>
        </main>
    )
}
