import {kv} from "@vercel/kv";

export default class CacheService<T> {
    public set(key: string, value: T): Promise<T | "OK" | null> {
        return kv.set(key, value);
    }

    public async get(key: string): Promise<T | null> {
        return kv.get(key);
    }
}