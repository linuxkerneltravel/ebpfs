import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";
import Input from "@/pages/components/Input";
import {useState} from "react";
import {useRouter} from "next/router";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const router = useRouter();

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

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar
                src={State.account?.avatar ? State.account.avatar : `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png`}/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-row gap-32 items-center justify-center">
                <div className="flex flex-col gap-2">
                    <img src="favicon.ico" alt="" style={{height: "72px"}} width="72"/>
                    <p className="text-3xl text-gray-600">欢迎使用 eBPF Hub</p>
                    <p className="text-xl text-gray-600">搜索、探索 eBPF 程序</p>
                </div>
                <div className="mt-2">
                    {
                        State.isLogin()
                            ? <Button icon="icons8-github.svg" href="/account" text="查看账号"/>
                            : <div className="mt-2">
                                <div className="bg-white flex flex-col flex-wrap gap-4 p-16 rounded-2xl"
                                     style={{width: '480px'}}>
                                    <p className="font-bold text-xl"></p>
                                    <Input placeholder="邮箱（未注册将自动注册）" height="48px" width="350px"
                                           onChange={setEmail}
                                           onEnterPress={() => {
                                           }}/>
                                    <Input placeholder="密码" height="48px" width="350px" onChange={setPassword}
                                           onEnterPress={() => {
                                           }}/>
                                    <Button text="登录" onclick={login}/>
                                    <Button icon="icons8-github.svg" text="使用 Github 登录" href="/api/oauth"/>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </main>
    )
}
