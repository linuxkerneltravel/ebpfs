export class Account {
    constructor(
        // 账号 ID
        public id: string,
        // OAuth2.0 的 openid
        public openid: string | null,
        // 昵称
        public nickname: string,
        // 头像
        public avatar: string,
        // 邮箱
        public email: string | null,
        // 密码
        public password: string | null,
        // 类型
        public type: AccountType,
        // 创建时间
        public created: number,
    ) {
    }
}

export enum AccountType {
    GITHUB = 'github',
    EMAIL = 'email'
}