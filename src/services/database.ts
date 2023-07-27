import {AccountTable, AccountType} from "@/data/account";
import {RepositoryTable} from "@/data/repository";
import {createKysely} from "@vercel/postgres-kysely";
import {Account} from "@/common/account";
import {Repository} from "@/common/repository";

interface Database {
    account: AccountTable;
    repository: RepositoryTable;
}

export default class DatabaseService<T> {
    constructor(
        public db = createKysely<Database>()
    ) { }

    public async autoMigrate() {
        // FIXME ？？？ 怪了 为什么没有检查表是否存在的接口 （考虑换用执行 SQL）
        try {
            // 初始化表
            await this.db.schema.createTable('repository')
                .addColumn('id', 'text', col => col.primaryKey())
                .addColumn('name', 'text')
                .addColumn('description', 'text')
                .addColumn('keywords', 'text')
                .addColumn('tags', 'text')
                .addColumn('readme', 'text')
                .addColumn('author', 'text')
                .addColumn('created', 'bigint')
                .execute();

            await this.db.schema.createTable('account')
                .addColumn('id', 'text', col => col.primaryKey())
                .addColumn('openid', 'text')
                .addColumn('nickname', 'text')
                .addColumn('avatar', 'text')
                .addColumn('type', 'text')
                .addColumn('created', 'bigint')
                .execute();
        } catch (ignored) { }
    }

    public async createAccount({id, openid, nickname, avatar, type, created}: Account) {
        return await this.db
            .insertInto('account')
            .values({id, openid, nickname, avatar, type, created})
            .execute();
    }

    public async readAccount(openid: string, type: AccountType) {
        return await this.db
            .selectFrom('account')
            .where('openid', '=', openid)
            .where('type', '=', type)
            .execute();
    }

    public async updateAccount(queryId: string, {id, openid, nickname, avatar, type, created}: Account) {
        return await this.db
            .updateTable('account')
            .set({id, openid, nickname, avatar, type, created})
            .where('id', '=', queryId)
            .execute();
    }

    public async deleteAccount(queryId: string) {
        return await this.db
            .deleteFrom('account')
            .where('id', '=', queryId)
            .execute();
    }

    public async createRepository(
        {
            id, account, create, update, organization, project, version,
            readme, type, repository, entry, author, keywords, tags
        }: Repository
    ) {
        return await this.db
            .insertInto('repository')
            .values({
                id, account, create, update, organization, project, version,
                readme, type, repository, entry, author, keywords, tags
            })
            .execute();
    }

    public async readRepository(id: string) {
        return await this.db
            .selectFrom('repository')
            .where('id', '=', id)
            .execute();
    }

    public async readRepositoryByAccount(account: string) {
        return await this.db
            .selectFrom('repository')
            .where('account', '=', account)
            .execute();
    }

    public async updateRepository(
        queryId: string,
        {
            id, account, create, update, organization, project, version,
            readme, type, repository, entry, author, keywords, tags
        }: Repository
    ) {
        return await this.db
            .updateTable('repository')
            .set({
                id, account, create, update, organization, project, version,
                readme, type, repository, entry, author, keywords, tags
            })
            .where('id', '=', queryId)
            .execute();
    }

    public async deleteRepository(id: string) {
        return await this.db
            .deleteFrom('repository')
            .where('id', '=', id)
            .execute();
    }
}