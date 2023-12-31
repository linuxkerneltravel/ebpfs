export class Token {
    constructor(
        // TOKEN
        public token: string,
        // 所属账号
        public belong: string,
        // TOKEN 类型
        public type: TokenType,
        // 创建时间
        public created: number,
        // 失效时间
        public expire: number
    ) {
    }
}

export enum TokenType {
    OAUTH_TOKEN = "oauth_token",
    ACCOUNT_API_KEY = "account_api_key",
    EMAIL_VERIFY_CODE = "email_verify_code"
}