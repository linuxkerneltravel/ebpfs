import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import {useRouter} from "next/router";
import {useState} from "react";
import {Repository} from "@/common/repository";
import {State} from "@/pages/_app";
import {marked} from "marked";

const inter = Inter({subsets: ['latin']});

export default function RepositoryPage() {
    (function () {
        State.load()
    }());

    const {id} = useRouter().query;
    const [result, setResult] = useState<Repository>();
    const avatar = State.account?.avatar ? State.account.avatar : `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png`;

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,          // 允许 Git Hub标准的markdown.
        pedantic: false,    // 不纠正原始模型任何的不良行为和错误
        breaks: false,      // 允许回车换行
    });

    fetch(result?.readme as string)
        .then(result => result.text())
        .then(data => {
            let dom = document.getElementById('marked');
            if (dom) dom.innerHTML = marked(data);
        });

    if (id && !result) {
        fetch('/api/repository?id=' + id)
            .then(result => result.json() as Promise<Repository[]>)
            .then(data => {
                if (data.length === 0) return;
                setResult(data[0]);
            });
    }

    return (
        <main className={`flex min-h-screen flex-col ${inter.className} bg-gray-200`}>
            <Navbar src={avatar}/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col" style={{paddingTop: '60px'}}>
                <div className="w-full bg-white flex flex-row justify-center items-center gap-16"
                     style={{height: '420px'}}>
                    <div id="icon">
                        <img src="favicon.ico" className="rounded-full" style={{height: '128px', width: '128px'}}
                             alt="icon"/>
                    </div>
                    <div id="content" className="" style={{width: '70%'}}>
                        <p className="text-4xl font-bold">lmp / bootstrap</p>
                        <div style={{height: '8px'}}/>
                        <p className="text-gray-400 text-base">{`创建者 ${result?.author.join(" ")}`}</p>
                        <p className="text-gray-400 text-base">{`创建于 ${result?.create}`}</p>
                        <p className="text-gray-400 text-base">{`代码仓库 ${result?.repository}`}</p>
                        <p className="text-gray-400 text-base">{`版本 ${result?.version}`}</p>
                        <div style={{height: '24px'}}/>
                        <p className="text-sm">{`${result?.readme}`}</p>
                        <div style={{height: '24px'}}/>
                        <div className="flex justify-center items-center rounded-16 bg-gray-50 border-gray-900"
                             style={{width: '220px', minHeight: '48px'}}>
                            <p>`ecli run ${result?.organization}/${result?.project}`</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center bg-white" style={{height: '48px'}}>
                    <div className="h-full" style={{width: '70%'}}>
                        <div className="flex justify-center items-center bg-gray-50"
                             style={{height: '48px', width: '128px', borderBottom: '8px solid #edb74d'}}>
                            <p className="text-sm font-bold">README</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-12">
                    <div id="marked" className="bg-white p-16 rounded-xl" style={{width: '70%'}}/>
                </div>
            </div>
        </main>
    )
}
