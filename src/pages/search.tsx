import {Inter} from 'next/font/google'
import Searchbar from "@/pages/components/Searchbar";
import {useRouter} from "next/router";
import {useState} from "react";
import {Index} from "@/common";
import Message from "@/common/message";

const inter = Inter({subsets: ['latin']})

export default function Search() {
    const {query} = useRouter().query;
    const result = useState<Index[]>()

    if (query) {
        fetch('/api/search?query=' + query)
            .then(result => result.json() as Promise<Message<any>>)
            .then(data => {
                console.log(data.data);
            });
    }

    return (
        <main className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-8 items-center justify-center">
                <p className="text-3xl text-gray-600">eBPF Hub Search</p>
                <div className="flex flex-col gap-4 justify-center items-center">
                    <Searchbar placeholder="开始探索 eBPF Hub 吧！" width="480px" height="42px" indent="16px"/>
                    <p className="text-gray-400 text-xs">按下 Enter 键进行搜索</p>
                </div>
                {(!query) && <img src="https://github.com/images/modules/search/home-desktop-light.webp" alt=""/>}
            </div>
        </main>
    )
}
