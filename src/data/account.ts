import {Generated} from "kysely";

export class AccountTable {
    constructor(
        // 账号 ID
        public id: Generated<string>,
        // OAuth2.0 的 openid
        public openid: string,
        // 昵称
        public nickname: string,
        // 头像
        public avatar: string,
        // 类型
        public type: AccountType,
        // 创建时间
        public created: number,
    ) {
    }
}

export enum AccountType {
    GITHUB = 'github',
}