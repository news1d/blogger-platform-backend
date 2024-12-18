import { Request, Response, NextFunction } from 'express';
import {HTTP_STATUSES} from "../helpers/http-statuses";
import {RequestModel} from "../entities/request.entity";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip || 'unknown';
    const URL = req.originalUrl;
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000)
    const LIMIT = 5;

    try {
        const count = await RequestModel.countDocuments({
            IP: IP,
            URL: URL,
            date: { $gte: tenSecondsAgo }
        })

        if (count >= LIMIT) {
            res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
            return;
        }

        await RequestModel.create({
            IP: IP,
            URL: URL,
            date: now
        })

        next();
    } catch (err) {
        console.error('Error in rate limit middleware:', err);
    }
}