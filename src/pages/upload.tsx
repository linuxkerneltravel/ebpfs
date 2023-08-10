import {State} from "@/pages/_app";
import {Token} from "@/common/token";
import {useState} from "react";
import Button from "@/pages/components/Button";
import {Inter} from "next/font/google";
import Input from "@/pages/components/Input";
import {useRouter} from "next/router";

const inter = Inter({subsets: ['latin']})

export default function UploadPage() {
    (function () {
        State.load()
    }());

    const router = useRouter();

    //
    // 提交仓库表单
    //
    // 组织
    const [organization, setOrganization] = useState<string>('');
    // 项目
    const [project, setProject] = useState<string>('');
    // 版本
    const [version, setVersion] = useState<string>('');
    // 仓库
    const [repository, setRepository] = useState<string>('');
    // README 链接
    const [readme, setReadme] = useState<string>('');
    // 入口
    const [entry, setEntry] = useState<string>('');
    // 作者
    const [author, setAuthor] = useState<string[]>([]);
    // 标签
    const [tags, setTags] = useState<string[]>([]);

    const token = State.token as Token;

    const submit = () => {
        fetch('/api/repository', {
            method: 'POST',
            headers: {
                'Authorization': token.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                update: new Date().getTime().toString(),
                organization: organization,
                project: project,
                version: version,
                repository: repository,
                readme: readme,
                type: 'wasm',
                entry: entry,
                author: author,
                tags: tags
            })
        })
            .then(result => result.json())
            .then(() => router.push("/account").then(ignore => 0));
    };

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                {
                    <div>
                        <div className="bg-white flex flex-col flex-wrap gap-4 p-16 rounded-2xl"
                             style={{width: '480px'}}>
                            <p className="font-bold text-xl">提交一个仓库 / 更新仓库</p>
                            <Input placeholder="组织" height="48px" width="350px" onChange={setOrganization}
                                   onEnterPress={() => {
                                   }}/>
                            <Input placeholder="项目" height="48px" width="350px" onChange={setProject}
                                   onEnterPress={() => {
                                   }}/>
                            <Input placeholder="版本" height="48px" width="350px" onChange={setVersion}
                                   onEnterPress={() => {
                                   }}/>
                            <Input placeholder="代码仓库" height="48px" width="350px" onChange={setRepository}
                                   onEnterPress={() => {
                                   }}/>
                            <Input placeholder="README 链接" height="48px" width="350px" onChange={setReadme}
                                   onEnterPress={() => {
                                   }}/>
                            <Input placeholder="入口" height="48px" width="350px" onChange={setEntry}
                                   onEnterPress={() => {
                                   }}/>
                            <Input placeholder="作者（使用 , 分隔多个作者）" height="48px" width="350px"
                                   onChange={(str) => setAuthor(str.split(","))} onEnterPress={() => {
                            }}/>
                            <Input placeholder="标签（使用 , 分隔多个标签）" height="48px" width="350px"
                                   onChange={(str) => setTags(str.split(","))} onEnterPress={() => {
                            }}/>
                            <Button text="提交" onclick={submit}/>
                        </div>
                    </div>
                }
            </div>
        </main>
    );
}