import {Inter} from 'next/font/google'
import Searchbar from "@/pages/components/Searchbar";
import {useRouter} from "next/router";
import {useState} from "react";
import {Index} from "@/common";
import Message from "@/common/message";
import Row from "@/pages/components/Row";
import Loading from "@/pages/components/Loading";
import {State} from "@/pages/_app";
import Navbar from "@/pages/components/Navbar";

const inter = Inter({subsets: ['latin']})

export default function Search() {
    (function () {
        State.load()
    }());

    const {query} = useRouter().query;
    const [result, setResult] = useState<Index[]>()
    const [tags, setTags] = useState<string[]>()
    const [authors, setAuthors] = useState<string[]>()
    const avatar = State.account?.avatar ? State.account.avatar : `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png`;

    if (query && !result) {
        fetch('/api/search?query=' + query)
            .then(result => result.json() as Promise<Message<Index[]>>)
            .then(data => {
                setResult(data.data)

                let t: string[] = [];
                data && data.data.forEach((index) => {
                    index.tags?.forEach(tag => {
                        if (t.indexOf(tag) === -1) {
                            t.push(tag);
                        }
                    });
                });

                setTags(t);

                let a: string[] = [];
                data && data.data.forEach((index) => {
                    index.author?.forEach(author => {
                        if (a.indexOf(author) === -1) {
                            a.push(author);
                        }
                    });
                })

                setAuthors(a);
            });
    }

    return (
        <main className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar src={avatar}/>
            <div
                className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-8 items-center justify-center mt-16 mb-16">
                <p className="text-3xl text-gray-600">eBPF Hub Search</p>
                <div className="flex flex-col gap-4 justify-center items-center">
                    <Searchbar placeholder="开始探索 eBPF Hub 吧！" width="480px" height="42px" indent="16px"
                               textColor="#000"/>
                    <p className="text-gray-400 text-xs">按下 Enter 键进行搜索</p>
                </div>
                {(!query) && <img src="https://github.com/images/modules/search/home-desktop-light.webp" alt=""/>}
                {
                    (query && !result) &&
                    <div className="flex justify-center items-center">
                        <Loading/>
                    </div>
                }
                {
                    (query && result) &&
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-3 pl-4 pr-4" style={{minWidth: "280px"}}>
                            <div>
                                <p className="text-xl font-bold">过滤器</p>
                                <p className="text-sm">整理当前的搜索结果</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <p className="text-base">Tags</p>
                                <div className="flex flex-col px-4 gap-1">
                                    {
                                        tags && tags.map && tags.map((tag, index) => {
                                            return (
                                                <div key={index} className="flex items-center">
                                                    <input id="default-checkbox" type="checkbox" value=""
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                                                    <label htmlFor="default-checkbox"
                                                           className="ml-2 text-sm font-medium text-gray-900">{tag}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <p className="text-base">Author</p>
                                <div className="flex flex-col px-4 gap-1">
                                    {
                                        authors && authors.map && authors.map((author, index) => {
                                            return (
                                                <div key={index} className="flex items-center">
                                                    <input id="default-checkbox" type="checkbox" value=""
                                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                                                    <label htmlFor="default-checkbox"
                                                           className="ml-2 text-sm font-medium text-gray-900">{author}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <p className="text-gray-400 text-xs">关键词 {query} 共 {result.length} 个结果</p>
                            {result.map((index) => (
                                <Row key={index.id}
                                     title={`${index.organization}  / ${index.project}`}
                                     text={index.content.length > 500 ? index.content.slice(0, 500) : index.content}
                                     author={index.author}
                                     tags={index.tags}
                                     url={`/repository?id=${index.id}`}
                                />
                            ))}
                        </div>
                    </div>
                }
            </div>
        </main>
    )
}
