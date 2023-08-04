import {Inter} from 'next/font/google'
import Navbar from "@/pages/components/Navbar";
import {useRouter} from "next/router";
import {useState} from "react";
import {Repository} from "@/common/repository";

const inter = Inter({subsets: ['latin']});

export default function RepositoryPage() {
    const {id} = useRouter().query;
    const [result, setResult] = useState<Repository>();

    if (id && !result) {
        fetch('/api/repository?id=' + id)
            .then(result => result.json() as Promise<Repository>)
            .then(data => setResult(data));

        console.log(result);
    }

    return (
        <main style={{backgroundImage: `url("https://i.im.ge/2023/07/17/5jrzzK.F0ci1uZakAAukOL.jpg")`}}
              className={`flex min-h-screen flex-col ${inter.className} bg-fixed bg-cover bg-center`}>
            <Navbar/>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">

            </div>
        </main>
    )
}
