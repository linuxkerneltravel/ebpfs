import {kv} from "@vercel/kv";

export default class CacheService<T> {
    public set(key: string, value: T): Promise<T | "OK" | null> {
        return kv.set(key, value);
    }

    public expire(key: string, expire: number): Promise<0 | 1> {
        return kv.expire(key, expire);
    }

    public get(key: string): T | {} {
        return kv.get(key) as T | {};
    }
}