import {kv} from "@vercel/kv";

export default class CacheService<T> {
    constructor() {
        // TODO 清理过期 Token
    }

    set(key: string, value: T): Promise<T | "OK" | null> {
        return kv.set(key, value);
    }

    get(key: string): T | {} {
        return kv.get(key) as T | {};
    }
}