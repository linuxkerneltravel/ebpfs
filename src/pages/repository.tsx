import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar"
import {useRouter} from "next/router"
import {useState} from "react"
import {Repository} from "@/common/repository"
import {State} from "@/pages/_app"
import {marked} from "marked"
import Message from "@/common/message"

const inter = Inter({subsets: ['latin']})

interface RepositoryData {
    repository: Repository[]
}

export default function RepositoryPage() {
    (function () {
        State.load()
    }())

    const {id} = useRouter().query
    const [result, setResult] = useState<Repository>()
    const avatar = State.account?.avatar ? State.account.avatar : `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png`

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,          // 允许 Git Hub标准的markdown.
        pedantic: false,    // 不纠正原始模型任何的不良行为和错误
        breaks: false,      // 允许回车换行
    })

    if (typeof window !== "undefined" && result?.readme) {
        fetch(result.readme)
            .then(result => result.text())
            .then(data => {
                // 裁剪第二个 --- 之后的内容
                data = data.substring(data.indexOf("---", 4) + 3)

                let dom = document.getElementById('marked')
                if (dom) dom.innerHTML = marked(data);
            })
    }

    if (id && !result) {
        fetch('/api/repository?id=' + id)
            .then(result => result.json() as Promise<Message<RepositoryData>>)
            .then(data => {
                console.log(data)

                if (data.status === 200 && data.data.repository.length > 0) {
                    setResult(data.data.repository[0])
                }
            })
    }

    return (
        <main className={`flex min-h-screen flex-col ${inter.className} bg-gray-200`}>
            <Navbar src={avatar}/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col">
                <div className="w-full bg-white flex flex-row justify-center items-center"
                     style={{height: '420px'}}>
                    <div className="flex flex-row gap-16 items-center" style={{width: '50%', minWidth: "960px"}}>
                        <div id="icon">
                            <img src="favicon.ico" className="rounded-full" style={{height: '72px', width: '72px'}}
                                 alt="icon"/>
                        </div>
                        <div id="content">
                            <p className="text-2xl font-bold">{`${result?.organization} / ${result?.project}`}</p>
                            <div style={{height: '8px'}}/>
                            <p className="text-gray-400 text-sm">{`创建者 ${result?.author.slice(2, result?.author.length - 2)}`}</p>
                            <p className="text-gray-400 text-sm">{`创建于 ${new Date((result !== undefined && result.created !== undefined) ? parseInt(result.created) : new Date().getTime())}`}</p>
                            <p className="text-gray-400 text-sm">{`代码仓库 ${result?.repository}`}</p>
                            <p className="text-gray-400 text-sm">{`版本 ${result?.version}`}</p>
                            <div style={{height: '24px'}}/>
                            <div className="flex justify-center items-center rounded-16 bg-gray-50 border-gray-900"
                                 style={{width: '220px', minHeight: '48px'}}>
                                <p>{`ecli run ${result?.organization}/${result?.project}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white" style={{height: '36px'}}>
                    <div className="h-full" style={{width: '50%', minWidth: "960px"}}>
                        <div className="flex justify-center items-center bg-gray-50"
                             style={{height: '36px', width: '108px', borderBottom: '4px solid #edb74d'}}>
                            <p className="text-xs">README</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-12 mb-12">
                    {
                        result
                            ? <div id="marked" className="markdown bg-white p-32" style={{width: '50%', minWidth: "960px"}}/>
                            : <div className="bg-white p-16 flex justify-center items-center"
                                   style={{width: '50%', minWidth: "960px"}}>
                                <p className="text-2xl font-bold">该仓库未收录</p>
                            </div>
                    }
                </div>
            </div>
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
