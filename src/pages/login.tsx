import {useEffect} from "react";
import Loading from "@/pages/components/Loading";
import {useRouter} from "next/router";
import {State} from "@/pages/_app";

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const {code, state} = router.query;

            if (typeof code === "string" && typeof state === "string") {
                // POST /api/login
                fetch(`/api/login?code=${code}&state=${state}`)
                    .then(res => res.json())
                    .then(res => {
                        State.save(res.data.token, res.data.account);

                        router.push("/").then(ignore => {
                        });
                    });
            }
        }
    }, []);

    return (
        <main className={`flex min-h-screen flex-col bg-fixed bg-cover bg-center`}>
            <div className="min-h-screen w-full backdrop-blur-2xl flex flex-col gap-2 items-center justify-center">
                <Loading/>
            </div>
        </main>
    );
}