export class Account {
    constructor(
        // 账号 ID
        public id: string,
        // OAuth2.0 的 openid
        public openid: string,
        // 昵称
        public nickname: string,
        // 头像
        public avatar: string,
        // 类型
        public type: AccountType,
        // 关键字
        public keys: string[],
        // 关联到账号的 repository 的 id
        public repositories: string[],
    ) {
    }
}

export enum AccountType {
    GITHUB = 'github',
}