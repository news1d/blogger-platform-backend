import {SETTINGS} from "../settings";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../helpers/http-statuses";
import {jwtService} from "../application/jwt-service";
import {sessionService} from "../modules/sessions/session-service";
import {blacklistService} from "../blacklist/blacklist-service";

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

    const userId = await jwtService.getUserIdByToken(token, SETTINGS.JWT_SECRET)
    if (userId) {
        req.userId = userId
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
}

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    const isBlacklisted = await blacklistService.findToken(refreshToken)

    if (isBlacklisted) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return;
    }

    const tokenData = await jwtService.getTokenData(refreshToken, SETTINGS.REFRESH_SECRET);
    const session = await sessionService.findSessionByDeviceId(tokenData!.deviceId);

    // Проверяем существование сессии
    if (!session) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    // Проверяем, что токен не истёк
    if (new Date() > session.exp) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    req.userId = session.userId;
    next();
}