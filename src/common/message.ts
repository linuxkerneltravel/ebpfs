export default class Message<T> {
    constructor(
        public status: number,
        public message: string,
        public data: T
    ) {
    }
}