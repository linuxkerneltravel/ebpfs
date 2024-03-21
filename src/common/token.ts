export interface Token {
    token: string,
    belong: string,
    type: TokenType,
    created: number,
    expire: number,
}

export enum TokenType {
    OAUTH_TOKEN = "oauth_token",
    ACCOUNT_API_KEY = "account_api_key",
    EMAIL_VERIFY_CODE = "email_verify_code",
}