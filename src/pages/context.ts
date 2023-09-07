import {Token} from "@/common/token";
import {Account} from "@/common/account";
import React from "react";

export interface ContextProps {
    token: Token | null;
    account: Account | null;
    isLogin: boolean;

    // useState
    setToken?: any;
    setAccount?: any;
}

const Context = React.createContext<ContextProps>({
    token: null,
    account: null,
    isLogin: false,
});

export default Context;