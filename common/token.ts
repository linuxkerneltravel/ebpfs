export class Token {
    constructor(
        public token: string,
        public id: string,
        public type: TokenType,
        public expire: number
    ) {
    }
}

export enum TokenType {
    OAUTH_TOKEN = "oauth_token",
    ACCOUNT_API_KEY = "account_api_key"
}