import {Generated} from "kysely";
import crypto from "crypto";

export class AccountTable {
    constructor(
        // 账号 ID
        public id: Generated<string>,
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

    public static getPassword(password: string): string {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

    public static checkPassword(password: string, input: string): boolean {
        const hash = crypto.createHash('sha256');
        hash.update(input);
        return password === hash.digest('hex');
    }
}

export enum AccountType {
    GITHUB = 'github',
    EMAIL = 'email'
}