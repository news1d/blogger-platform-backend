import {SETTINGS} from "../settings";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../helpers/http-statuses";
import {jwtService} from "../application/jwt-service";

export const ADMIN_AUTH = SETTINGS.ADMIN_AUTH;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const encodedAuthData = Buffer.from(ADMIN_AUTH).toString('base64');
    const validAuthValue = `Basic ${encodedAuthData}`;
    const authHeader = req.headers.authorization?.trim();

    if (authHeader && authHeader === validAuthValue) {
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.userId = userId
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
}