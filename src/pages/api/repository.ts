import type {NextApiRequest, NextApiResponse} from 'next'
import CacheService from "@/services/cache"
import {Token} from "@/common/token"
import {Repository} from "@/common/repository"
import DatabaseService from "@/services/database"
import SearchService from "@/services/search"
import Message from "@/common/message"

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message<any>>) {
    if (req.method === 'GET') {
        const {id} = req.query
        const repositories = new DatabaseService()

        // 如果没有携带参数则按获取创建时间最新的 10 个仓库
        if (!id || id === '') {
            const repository = await repositories.readRepositoryByLimit(10) as Repository[]

            // 获取 readme
            for (const item of repository) {
                let content = await fetch(item.readme).then(async (response) => response.text())
                content = content.length > 500
                    ? content.substring(0, 500).replace(/\n/g, "")
                    : content.replace(/\n/g, "")

                item.readme = content
                // 将 tags 和 author 从字符串转换为数组
                // @ts-ignore
                item.tags = item.tags.split(',')
                // @ts-ignore
                item.author = item.author.split(',')
            }

            res.status(200).json(
                {
                    status: 200,
                    message: 'OK',
                    data: {repository: repository}
                }
            );

            return;
        }

        const repo = await repositories.readRepository(id as string) as Repository[]
        res.status(200).json({status: 200, message: 'OK', data: {repository: repo}})
    } else if (req.method === 'POST') {
        // 根据 Token 获取账号 ID
        const header = req.headers['authorization']

        if (header === undefined || header === null) {
            res.status(400).json({status: 400, message: 'token is invalid.', data: null})
            return
        }

        const tokens = new CacheService<Token>()
        const repositories = new DatabaseService()

        const token = await tokens.get(header as string) as Token

        if (token === undefined || token === null) {
            res.status(400).json({status: 400, message: 'token is invalid.', data: null})
            return
        }

        // 解构 form-data
        const {
            update, organization, project,
            version, readme, type, repository,
            entry, author, tags
        }: Repository = req.body

        // 初始化搜索服务
        const search = new SearchService()
        // 获取 readme
        const content = await fetch(readme).then(async (response) => response.text())

        // 检查是否已经存在
        const repos = await repositories.readRepositoryByOrganizationAndProject(organization, project) as Repository[]

        if (repos && repos.length !== 0) {
            let match = repos.filter((item) => item.account === token.belong)

            // 意味着仓库重名
            if (match && match.length !== 0) {
                res.status(400).json({status: 400, message: 'repository is already exists.', data: null})
                return
            }

            // 不重名则更新
            const repo = repos[0]

            await repositories.updateRepository(repo.id, {
                id: repo.id,
                account: repo.account,
                created: repo.created,
                update: new Date().getTime().toString(),
                organization: organization,
                project: project,
                version: version,
                readme: readme,
                type: type,
                repository: repository,
                entry: entry,
                author: author,
                tags: tags
            })

            await search.update({
                id: repo.id,
                url: repo.repository,
                organization: repo.organization,
                project: repo.project,
                readme: repo.readme,
                // 字符数量限制为 5000 避免触发 algolia 的限制阈值
                content: content.length > 5000
                    ? content.substring(0, 5000).replace(/\n/g, "")
                    : content.replace(/\n/g, ""),
                author: repo.author,
                tags: repo.tags
            })

            res.status(200).json({status: 200, message: 'OK', data: repo})
            return
        } else {
            const repo = new Repository(
                crypto.randomUUID(),
                token.belong,
                new Date().getTime().toString(),
                update,
                organization,
                project,
                version,
                readme,
                type,
                repository,
                entry,
                author,
                tags
            )

            await repositories.createRepository(repo)
            await search.upload({
                id: repo.id,
                url: repo.repository,
                organization: repo.organization,
                project: repo.project,
                readme: repo.readme,
                // 字符数量限制为 5000 避免触发 algolia 的限制阈值
                content: content.length > 5000
                    ? content.substring(0, 5000).replace(/\n/g, "")
                    : content.replace(/\n/g, ""),
                author: repo.author,
                tags: repo.tags
            })

            res.status(200).json({status: 200, message: 'OK', data: repo})
        }
    } else res.status(400).json({status: 400, message: 'request method not match.', data: null})
}