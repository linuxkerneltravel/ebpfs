export class Repository {
    constructor(
        // 索引 ID
        public id: string,
        // 属于哪个用户
        public account: string,
        // 创建时间
        public created: string,
        // 更新时间
        public update: string,
        // 组织名
        public organization: string,
        // 项目
        public project: string,
        // 版本号
        public version: string,
        // README 文件 url
        public readme: string,
        // 类型
        public type: string,
        // 仓库 url
        public repository: string,
        // 执行入口
        public entry: string,
        // 作者
        public author: string[],
        // 标签
        public tags: string[]
    ) {
    }
}