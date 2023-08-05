import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";
import {Account} from "@/common/account";
import {Repository} from "@/common/repository";
import {useEffect, useState} from "react";
import Message from "@/common/message";
import {Token} from "@/common/token";

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

    const token = State.token as Token;

    // 不要在任意 return 后使用 useState，因为这会导致每次渲染都会重置 state
    const [result, setResult] = useState<Response>();
    // 更新时间
    const [updateTime, setUpdateTime] = useState<string>('');
    // 组织
    const [organizations, setOrganizations] = useState<string>('');
    // 项目
    const [projects, setProjects] = useState<string>('');
    // 版本
    const [version, setVersion] = useState<string>('');
    // 仓库
    const [repositories, setRepositories] = useState<string>('');
    // README 链接
    const [readme, setReadme] = useState<string>('');
    // 项目链接
    const [project, setProject] = useState<string>('');
    // 仓库类型
    const [type, setType] = useState<string>('');
    // 仓库地址
    const [url, setUrl] = useState<string>('');
    // 入口
    const [entry, setEntry] = useState<string>('');
    // 作者
    const [author, setAuthor] = useState<string[]>([]);
    // 标签
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        // 获取账号信息的逻辑
        // 这里的 Token 在 isLogin 校验中判定为非空 那么这里一定不为空
        fetch('/api/account', {headers: {'Authorization': token.token}})
            .then(result => result.json() as Promise<Message<Response>>)
            .then(data => setResult(data.data));
    }, []);

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar src={result?.account.avatar}/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                {
                    result
                        ? <div>
                            <div className="bg-white flex flex-col gap-4 p-16 rounded-2xl" style={{width: '320px'}}>
                                <div className="flex flex-col justify-center items-center">
                                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                                         className="rounded-full" style={{height: '64px', width: '64px'}}></img>
                                </div>
                                <Button text="添加一个新的包"/>
                                <Button text="退出登录"/>
                            </div>
                        </div>
                        : <div className="mt-2">
                            <Button icon="icons8-github.svg" text="使用 Github 登录" href="/api/oauth"/>
                        </div>
                }
            </div>
        </main>
    )
}
