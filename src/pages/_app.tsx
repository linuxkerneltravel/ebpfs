import '@/styles/globals.css'
import App from "next/app";
import {Token} from "@/common/token";
import {Account} from "@/common/account";
import {withRouter} from "next/router";

export class State {
    // TODO: 从 localStorage 中读取 token 和 account
    // TODO: 清理 localStorage 中的 token 和 account

    public static token: Token | null = null;
    public static account: Account | null = null;

    public static isLogin(): boolean {
        return State.token !== null;
    }
}

class MyApp extends App {
    render() {
        const {Component, pageProps, router} = this.props;
        const WithRouterComponent = withRouter(Component);
        return <WithRouterComponent {...pageProps} router={router}/>;
    }
}

export default MyApp;