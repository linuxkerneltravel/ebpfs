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
    ) {
    }

    public async autoMigrate() {
        // FIXME ？？？ 怪了 为什么没有检查表是否存在的接口 （考虑换用执行 SQL）
        try {
            // 初始化表
            await this.db.schema.createTable('repository')
                .addColumn('id', 'text', col => col.primaryKey())
                .addColumn('account', 'text')
                .addColumn('update', 'text')
                .addColumn('organization', 'text')
                .addColumn('project', 'text')
                .addColumn('version', 'text')
                .addColumn('readme', 'text')
                .addColumn('type', 'text')
                .addColumn('repository', 'text')
                .addColumn('entry', 'text')
                .addColumn('author', 'text')
                .addColumn('tags', 'text')
                .addColumn('created', 'bigint')
                .execute();


        } catch (ignore) {
        }

        try {
            await this.db.schema.createTable('account')
                .addColumn('id', 'text', col => col.primaryKey())
                .addColumn('openid', 'text')
                .addColumn('nickname', 'text')
                .addColumn('avatar', 'text')
                .addColumn('email', 'text')
                .addColumn('password', 'text')
                .addColumn('type', 'text')
                .addColumn('created', 'bigint')
                .execute();
        } catch (ignore) {
        }
    }

    public async createAccount({id, openid, nickname, avatar, email, password, type, created}: Account) {
        return await this.db
            .insertInto('account')
            .values({id, openid, nickname, avatar, email, password, type, created})
            .execute();
    }

    public async readAccount(query: string, type: AccountType) {
        return await this.db
            .selectFrom('account')
            // 按照类型查询 openid（目前就 Github 一种） 或者 email
            .where(type === AccountType.GITHUB ? 'openid' : 'email', '=', query)
            .where('type', '=', type)
            .selectAll()
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
            id, account, created, update, organization, project, version,
            readme, type, repository, entry, author, tags
        }: Repository
    ) {
        return await this.db
            .insertInto('repository')
            .values({
                id, account, created, update, organization, project, version,
                readme, type, repository, entry, author, tags
            })
            .execute();
    }

    public async readRepository(id: string) {
        return await this.db
            .selectFrom('repository')
            .where('id', '=', id)
            .selectAll()
            .execute();
    }

    public async readRepositoryByAccount(account: string) {
        return await this.db
            .selectFrom('repository')
            .where('account', '=', account)
            .selectAll()
            .execute();
    }

    public async updateRepository(
        queryId: string,
        {
            id, account, created, update, organization, project, version,
            readme, type, repository, entry, author, tags
        }: Repository
    ) {
        return await this.db
            .updateTable('repository')
            .set({
                id, account, created, update, organization, project, version,
                readme, type, repository, entry, author, tags
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