import {AccountTable, AccountType} from "@/data/account"
import {RepositoryTable} from "@/data/repository"
import {createKysely} from "@vercel/postgres-kysely"
import {Account} from "@/common/account"
import {Repository} from "@/common/repository"
import {Statistic} from "@/common/statistic"
import {StatisticTable} from "@/data/statistic"

interface Database {
    account: AccountTable
    repository: RepositoryTable
    statistic: StatisticTable
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
                .execute()

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
                .execute()
        } catch (ignore) {
        }

        try {
            await this.db.schema.createTable('statistic')
                .addColumn('id', 'text', col => col.primaryKey())
                .addColumn('organization', 'text')
                .addColumn('project', 'text')
                .addColumn('visit', 'integer')
                .addColumn('search', 'integer')
                .addColumn('show', 'integer')
                .execute()
        } catch (ignore) {
        }
    }

    // Account
    public async createAccount({id, openid, nickname, avatar, email, password, type, created}: Account) {
        return await this.db
            .insertInto('account')
            .values({id, openid, nickname, avatar, email, password, type, created})
            .execute()
    }

    public async readAccount(query: string, type: AccountType) {
        return await this.db
            .selectFrom('account')
            // 按照类型查询 openid（目前就 Github 一种） 或者 email
            .where(type === AccountType.GITHUB ? 'openid' : 'email', '=', query)
            .selectAll()
            .execute()
    }

    public async readAccountById(id: string) {
        return await this.db
            .selectFrom('account')
            .where('id', '=', id)
            .selectAll()
            .execute()
    }

    public async updateAccount(queryId: string, {id, openid, nickname, avatar, type, created}: Account) {
        return await this.db
            .updateTable('account')
            .set({id, openid, nickname, avatar, type, created})
            .where('id', '=', queryId)
            .execute()
    }

    public async deleteAccount(queryId: string) {
        return await this.db
            .deleteFrom('account')
            .where('id', '=', queryId)
            .execute()
    }

    // Repository
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
            .execute()
    }

    public async readRepository(id: string) {
        return await this.db
            .selectFrom('repository')
            .where('id', '=', id)
            .selectAll()
            .execute()
    }

    public async readRepositoryByOrganizationAndProject(organization: string, project: string) {
        return await this.db
            .selectFrom('repository')
            .where('organization', '=', organization)
            .where('project', '=', project)
            .selectAll()
            .execute()
    }

    public async readRepositoryByAccount(account: string) {
        return await this.db
            .selectFrom('repository')
            .selectAll()
            .where('account', '=', account)
            .execute()
    }

    public async readRepositoryByLimit(limit: number) {
        // 选择数据库中前十个数据
        return await this.db
            .selectFrom('repository')
            .selectAll()
            .orderBy('created', 'desc')
            .limit(limit)
            .execute()
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
            .execute()
    }

    public async deleteRepository(id: string) {
        return await this.db
            .deleteFrom('repository')
            .where('id', '=', id)
            .execute()
    }

    // Statistic
    public async createStatistic({
                                     id, organization, project, visit, search, show
                                 }: Statistic) {
        return await this.db
            .insertInto('statistic')
            .values({
                id, organization, project, visit, search, show
            })
            .execute()
    }

    public async readStatistic(id: string) {
        return await this.db
            .selectFrom('statistic')
            .where('id', '=', id)
            .selectAll()
            .execute()
    }

    public async readStatisticByOrganizationAndProject(organization: string, project: string) {
        return await this.db
            .selectFrom('statistic')
            .where('organization', '=', organization)
            .where('project', '=', project)
            .selectAll()
            .execute()
    }

    public async readStatisticByVisit(limit: number) {
        return await this.db
            .selectFrom('statistic')
            .selectAll()
            .orderBy('visit', 'desc')
            .limit(limit)
            .execute()
    }

    public async readStatisticBySearch(limit: number) {
        return await this.db
            .selectFrom('statistic')
            .selectAll()
            .orderBy('search', 'desc')
            .limit(limit)
            .execute()
    }

    public async readStatisticByShow(limit: number) {
        return await this.db
            .selectFrom('statistic')
            .selectAll()
            .orderBy('show', 'desc')
            .limit(limit)
            .execute()
    }

    public async updateStatistic(
        queryId: string,
        {
            id, organization, project, visit, search, show
        }: Statistic
    ) {
        return await this.db
            .updateTable('statistic')
            .set({
                id, organization, project, visit, search, show
            })
            .where('id', '=', queryId)
            .execute()
    }

    public async updateStatisticByOrganizationAndProject(
        organization: string,
        project: string,
        {
            visit, search, show
        }: Statistic
    ) {
        return await this.db
            .updateTable('statistic')
            .set({
                visit, search, show
            })
            .where('organization', '=', organization)
            .where('project', '=', project)
            .execute()
    }

    public async deleteStatistic(id: string) {
        return await this.db
            .deleteFrom('statistic')
            .where('id', '=', id)
            .execute()
    }
}