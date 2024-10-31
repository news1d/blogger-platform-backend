import {SETTINGS} from "../settings";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../helpers/http-statuses";


export const ADMIN_AUTH = SETTINGS.ADMIN_AUTH;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const encodedAuthData = Buffer.from(ADMIN_AUTH).toString('base64');
    const validAuthValue = `Basic ${encodedAuthData}`;
    const authHeader = req.headers.authorization?.trim();

    if (authHeader && authHeader === validAuthValue) {
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}