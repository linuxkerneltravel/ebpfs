import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";
import {Account} from "@/common/account";
import {Repository} from "@/common/repository";
import {useEffect, useState} from "react";
import Message from "@/common/message";
import {Token} from "@/common/token";
import {useRouter} from "next/router";
import Input from "@/pages/components/Input";

const inter = Inter({subsets: ['latin']})

interface Response {
    id: string;
    account: Account;
    repositories: Repository[];
}

export default function AccountPage() {
    (function () {
        State.load()
    }());

    const router = useRouter();
    const token = State.token as Token;

    // 不要在任意 return 后使用 useState，因为这会导致每次渲染都会重置 state
    const [result, setResult] = useState<Response>();

    useEffect(() => {
        // 获取账号信息的逻辑
        // 这里的 Token 在 isLogin 校验中判定为非空 那么这里一定不为空
        if (token && token.token) {
            fetch('/api/account', {headers: {'Authorization': token.token}})
                .then(result => result.json() as Promise<Message<Response>>)
                .then(data => setResult(data.data));
        }
    }, [token]);

    const copy = () => {
        const input = document.createElement('input');
        input.value = token.token;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    };

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const login = () => {
        fetch('/api/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            })
            .then(result => result.json())
            .then(() => router.push("/account")
                .then(ignore => 0));
    }

    function renderLogin() {
        return (
            <div className="mt-2">
                <div className="bg-white flex flex-col flex-wrap gap-4 p-16 rounded-2xl"
                     style={{width: '480px'}}>
                    <p className="font-bold text-2xl mb-6">登录账号</p>
                    <Input placeholder="邮箱（未注册将自动注册）" height="48px" width="350px" onChange={setEmail}
                           onEnterPress={() => {
                           }}/>
                    <Input placeholder="密码" height="48px" width="350px" onChange={setPassword}
                           onEnterPress={() => {
                           }}/>
                    <Button text="登录" onclick={login}/>
                    <Button icon="icons8-github.svg" text="使用 Github 登录" href="/api/oauth"/>
                </div>
            </div>
        )
    }

    function renderAccount() {
        return (
            <div className="flex flex-row justify-center">
                <div className="bg-white flex flex-col gap-4 p-16 rounded-l-2xl" style={{width: '320px'}}>
                    <div className="flex flex-col justify-center items-center">
                        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                             className="rounded-full" style={{height: '64px', width: '64px'}} alt=""/>
                    </div>
                    <Button text="添加一个新的包" onclick={() => router.push("/upload")}/>
                    <Button text="复制当前账号 TOKEN" onclick={copy}/>
                    <Button text="退出登录" onclick={() => {
                        State.clear();
                        router.push("/").then(ignore => {
                        })
                    }}/>
                </div>
                <div className="bg-white flex flex-col p-16 rounded-r-2xl" style={{width: '640px'}}>
                    {
                        result?.repositories && result.repositories.length > 0
                            ? result?.repositories.map((repository, index) => {
                                return (
                                    <div className=""
                                         style={{height: '32px'}}
                                         key={index}>
                                        <div className="font-bold">`${repository.organization} / ${repository.project}`
                                        </div>
                                    </div>
                                )
                            })
                            : <div className="flex justify-center items-center">
                                <div className="font-bold">暂无包</div>
                            </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar src={result?.account.avatar}/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                {
                    // 获取账号有结果或者本地 localStorage 有 Token
                    result || token
                        ? renderAccount()
                        : renderLogin()
                }
            </div>
        </main>
    )
}
