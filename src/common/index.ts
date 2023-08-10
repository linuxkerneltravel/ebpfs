export class Index {
    constructor(
        public id: string,
        public url: string,
        public organization: string,
        public project: string,
        public readme: string,
        public content: string,
        public author: string[],
        public tags: string[],
    ) {
    }
}