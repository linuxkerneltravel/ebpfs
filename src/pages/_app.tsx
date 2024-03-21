import '@/styles/globals.css'
import App from "next/app"
import {Token} from "@/common/token"
import {Account} from "@/common/account"
import {withRouter} from "next/router"

export class State {
    public static token: Token | null = null
    public static account: Account | null = null

    // 从 localStorage 中读取 token 和 account
    public static load() {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token")
            const account = localStorage.getItem("account")
            if (token !== null && account !== null) {
                State.token = JSON.parse(token)
                State.account = JSON.parse(account)
            }
        }
    }

    // 清理 localStorage 中的 token 和 account
    public static clear() {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token")
            localStorage.removeItem("account")
        }

        State.token = null
        State.account = null
    }

    // 写入 localStorage
    public static save(token: Token, account: Account) {
        State.token = token
        State.account = account

        if (typeof window !== "undefined") {
            localStorage.setItem("token", JSON.stringify(State.token))
            localStorage.setItem("account", JSON.stringify(State.account))
        }
    }

    public static isLogin(): boolean {
        return State.token !== undefined &&
            State.token !== null &&
            State.account !== undefined &&
            State.account !== null;
    }
}

class MyApp extends App {
    render() {
        const {Component, pageProps, router} = this.props
        const WithRouterComponent = withRouter(Component)
        return <WithRouterComponent {...pageProps} router={router}/>
    }
}

export default MyApp