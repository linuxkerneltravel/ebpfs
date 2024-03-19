export default interface Message<T> {
    status: number,
    message: string,
    data: T,
}