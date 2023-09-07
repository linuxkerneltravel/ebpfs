import {Inter} from 'next/font/google'
import Card from "@/pages/components/Card";
import Navbar from "@/pages/components/Navbar";
import Button from "@/pages/components/Button";
import {State} from "@/pages/_app";
import Input from "@/pages/components/Input";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Message from "@/common/message";
import {Account} from "@/common/account";
import {Token} from "@/common/token";
import {Repository} from "@/common/repository";
import {Statistic} from "@/common/statistic";

const inter = Inter({subsets: ['latin']})

interface LoginResponse {
    account: Account;
    token: Token;
}

interface RepositoryResponse {
    repository: Repository[];
}

interface StatisticResponse {
    statistic: Statistic[];
}

export default function Home() {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repository, setRepository] = useState<Repository[]>([]);
    const [statistic, setStatistic] = useState<Statistic[]>([]);

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
            .then(res => res.json())
            .then(res => {
                let data = res as Message<LoginResponse | string>;

                console.log(data);

                if (data.status === 200) {
                    let re = res as Message<LoginResponse>;
                    State.token = re.data.token;
                    State.account = re.data.account;

                    return router.push('/account').then(() => {
                    });
                }

                if (data.status === 302) {
                    let re = res as Message<string>;

                    return router.push(re.data).then(() => {
                    });
                }
            });
    }

    useEffect(() => {
        fetch('/api/repository')
            .then(res => res.json())
            .then(res => {
                let data = res as Message<RepositoryResponse>;
                if (data.data && data.data.repository && data.status === 200) {
                    const repository = data.data.repository;

                    setRepository(repository);
                }
            });

        fetch('/api/statistic')
            .then(res => res.json())
            .then(res => {
                let data = res as Message<StatisticResponse>;
                if (data.data && data.data.statistic && data.status === 200) {
                    const statistic = data.data.statistic;

                    setStatistic(statistic);
                }
            })
    }, []);

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar
                isGlass={true}
                src={State.account?.avatar ? State.account.avatar : `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png`}/>
            <div style={{height: "640px"}}
                 className="w-full backdrop-blur-2xl flex flex-row gap-96 items-center justify-center">
                <div className="flex flex-col gap-2">
                    <img src="favicon.ico" alt="" style={{height: "72px"}} width="72"/>
                    <p className="text-3xl text-gray-900">欢迎使用 eBPF Hub</p>
                    <p className="text-xl text-gray-600">搜索、探索 eBPF 程序</p>
                </div>
                <div className="mt-2">
                    {
                        State.isLogin()
                            ? <div className="mt-2">
                                <div className="bg-white flex flex-col flex-wrap gap-4 p-16"
                                     style={{width: '450px'}}>
                                    <div>
                                        <p className="font-bold text-xl">欢迎回来</p>
                                        <p className="text-sm">前往主页查看已创建的包</p>
                                    </div>
                                    <Button icon="icons8-github.svg" text="账号主页" href="/account"/>
                                </div>
                            </div>
                            : <div className="mt-2">
                                <div className="bg-white flex flex-col flex-wrap gap-4 p-16"
                                     style={{width: '450px'}}>
                                    <p className="font-bold text-xl"></p>
                                    <Input placeholder="邮箱（未注册将自动注册）" height="42px" width="320px"
                                           onChange={setEmail}
                                           onEnterPress={() => {
                                           }}/>
                                    <Input placeholder="密码" height="42px" width="320px" onChange={setPassword}
                                           onEnterPress={() => {
                                           }}/>
                                    <Button text="登录" onclick={login}/>
                                    <Button icon="icons8-github.svg" text="使用 Github 登录" href="/api/oauth"/>
                                </div>
                            </div>
                    }
                </div>
            </div>
            <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
                <p className="text-2xl text-gray-900">eBPF Hub 是一个</p>
                <p className="text-2xl text-gray-900">存储 eBPF 包元信息与检索平台</p>
                <p className="text-sm mt-2 text-gray-600">迅速检索并获取流行的 eBPF 包</p>
                <div className="flex flex-row flex-wrap p-16 gap-8 m-8" style={{maxWidth: '960px', minHeight: '280px'}}>
                    {
                        repository.map((value, index) => {
                            return (
                                <Card key={index} org={value.organization} project={value.project}/>
                            )
                        })
                    }
                </div>
            </div>
            {
                <div className="min-h-screen w-full bg-white flex items-center justify-center">
                    <div className="flex flex-col shadow-xl p-16 gap-8 m-8"
                         style={{minWidth: '680px', minHeight: '480px'}}>
                        <p className="text-xl">eBPF 搜索统计 / 趋势</p>
                        <div>
                            {
                                statistic.length !== 0
                                    ? statistic.map((value, index) => {
                                        return (
                                            <div key={index}></div>
                                        )
                                    })
                                    : <div className="flex flex-col items-center justify-center">
                                        <p className="text-2xl">暂无统计数据</p>
                                        <p className="text-xl">收集数据中</p>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            }
            <div className="bg-white">
                <div className="flex flex-col justify-center items-center p-8 m-8">
                    <p>Powered By eBPF Hub</p>
                    <p>Open Source On <a className="text-blue-400"
                                         href="https://github.com/linuxkerneltravel/ebpfs"> Github </a></p>
                </div>
            </div>
        </main>
    )
}
