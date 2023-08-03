import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";

const inter = Inter({subsets: ['latin']})

export default function Upload() {
    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                {
                    State.isLogin() &&
                    <div className="mt-2">
                        <Button icon="icons8-github.svg" href={State.getGithubAuthorizeUrl()} text="使用 Github 登录"/>
                    </div>
                }
            </div>
        </main>
    )
}
