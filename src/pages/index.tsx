import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                <img src="favicon.ico" alt="" style={{height: "72px"}}/>
                <p className="text-3xl text-gray-600">欢迎使用 eBPF Hub</p>
                <p className="text-xl text-gray-600">搜索、探索 eBPF 程序</p>
                <div className="mt-2">
                    {
                        State.isLogin()
                            ? <Button icon="icons8-github.svg" href="/account" text="查看账号"/>
                            : <Button icon="icons8-github.svg" text="使用 Github 登录" href="/api/oauth"/>
                    }
                </div>
            </div>
        </main>
    )
}
