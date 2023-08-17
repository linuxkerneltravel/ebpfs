import {State} from "@/pages/_app";
import {useState} from "react";
import Button from "@/pages/components/Button";
import {Inter} from "next/font/google";
import Input from "@/pages/components/Input";
import {useRouter} from "next/router";

const inter = Inter({subsets: ['latin']})

export default function VerifyPage() {
    (function () {
        State.load()
    }());

    const router = useRouter();
    const {email, password} = router.query;

    // 组织
    const [code, setCode] = useState<string>('');

    const submit = () => {
        fetch('/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    code: code
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
                            <p className="font-bold text-xl">验证你的邮件地址</p>
                            <Input placeholder="验证码" height="48px" width="350px" onChange={setCode}
                                   onEnterPress={() => {
                                   }}/>
                            <Button text="提交" onclick={submit}/>
                        </div>
                    </div>
                }
            </div>
        </main>
    );
}