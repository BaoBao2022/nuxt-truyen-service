import NodeCache from 'node-cache';
const cache = new NodeCache();
import { Request, Response, NextFunction } from 'express';

export default function (duration: number) {
    return (req: Request, res: any, next: NextFunction) => {
        if (req.method !== 'GET') {
            console.error('Can not cache non-GET method!');
            return next();
        }
        const key = req.originalUrl;
        const cacheResponse = cache.get(key);
        if (cacheResponse) {
            console.log(`Cache hit for ${key}`);
            res.send(cacheResponse);
        } else {
            console.log(`Cache miss for ${key}`);
            res.originalSend = res.send;
            res.send = (body: any) => {
                res.originalSend(body);
                cache.set(key, body, duration);
            };
            next();
        }
    };
}
