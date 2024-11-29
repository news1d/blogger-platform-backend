import {Request, Response} from 'express';
import {userService} from "../users/user-service";
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {LoginInputModel, LoginSuccessViewModel, MeViewModel} from "../../types/auth.types";
import {jwtService} from "../../application/jwt-service";
import {UserInputModel} from "../../types/user.types";
import {authService} from "./auth-service";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {RegisterConfCodeModel, RegisterEmailResendModel} from "../../types/registration.types";
import {OutputErrorsType} from "../../types/output-errors.type";
import {blacklistService} from "../../blacklist/blacklist-service";

export const authController = {
    async login(req: Request<any, any, LoginInputModel>, res: Response<LoginSuccessViewModel>){
        const userIdOrNull = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!userIdOrNull) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return;
        }

        const accessToken = await jwtService.createJWT(userIdOrNull)
        const refreshToken = await jwtService.createRT(userIdOrNull)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        res.status(HTTP_STATUSES.OK_200).json({accessToken: accessToken})
    },
    async refreshToken(req: Request, res: Response) {
        await blacklistService.addToken(req.cookies.refreshToken)

        const newAccessToken = await jwtService.createJWT(req.userId!)
        const newRefreshToken = await jwtService.createRT(req.userId!)

        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        res.status(HTTP_STATUSES.OK_200).json({accessToken: newAccessToken})
    },
    async registration (req: Request<any, any, UserInputModel>, res: Response<OutputErrorsType>) {
        const result = await authService.registration(req.body.login, req.body.email, req.body.password)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    },
    async registerConfirmation(req: Request<any, any, RegisterConfCodeModel>, res: Response<OutputErrorsType>) {
        const result = await authService.registerConfirmation(req.body.code)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    },
    async registerEmailResending(req: Request<any, any, RegisterEmailResendModel>, res: Response<OutputErrorsType>) {
        const result = await authService.registerEmailResending(req.body.email)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    },
    async logout(req: Request, res: Response) {
        await blacklistService.addToken(req.cookies.refreshToken)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
    async getUserInfo(req: Request, res: Response<MeViewModel>){
        const userInfo = await authService.getMyInfo(req.userId!);
        res.status(HTTP_STATUSES.OK_200).json(userInfo!)
    }
}