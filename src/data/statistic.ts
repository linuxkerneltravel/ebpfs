import {Generated} from "kysely"

export class StatisticTable {
    constructor(
        // 索引 ID
        public id: Generated<string>,
        // 组织名
        public organization: string,
        // 项目
        public project: string,
        // 访问次数
        public visit: number,
        // 被搜索率
        public search: number,
        // 展示次数
        public show: number
    ) {
    }
}