import {Request, Response} from 'express';
import {UserService} from "../users/user-service";
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {
    LoginInputModel,
    LoginSuccessViewModel,
    MeViewModel,
    NewPasswordRecoveryInputModel
} from "../../types/auth.types";
import {jwtService} from "../../application/jwt-service";
import {UserInputModel} from "../../types/user.types";
import {AuthService} from "./auth-service";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {RegisterConfCodeModel, EmailInputModel} from "../../types/registration.types";
import {OutputErrorsType} from "../../types/output-errors.type";
import {blacklistService} from "../../blacklist/blacklist-service";
import {SETTINGS} from "../../settings";
import {SessionService} from "../sessions/session-service";

export class AuthController {
    constructor(protected authService: AuthService, protected userService: UserService, protected sessionService: SessionService ) {}

    async login(req: Request<any, any, LoginInputModel>, res: Response<LoginSuccessViewModel>){
        const userId = await this.userService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return;
        }

        const accessToken = await jwtService.createJWT(userId)
        const refreshToken = await jwtService.createRT(userId)

        const userAgent = req.headers['user-agent'];
        const deviceName = userAgent || 'Default Device';
        const ip = req.ip || 'unknown'

        await this.sessionService.createSession(userId, deviceName, ip, refreshToken)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        res.status(HTTP_STATUSES.OK_200).json({accessToken: accessToken})
    }

    async passwordRecovery(req: Request<any, any, EmailInputModel>, res: Response){
        await this.authService.passwordRecovery(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async newPassword(req: Request<any, any, NewPasswordRecoveryInputModel>, res: Response<OutputErrorsType>) {
        const result = await this.userService.newPassword(req.body.newPassword, req.body.recoveryCode)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        await blacklistService.addToken(req.cookies.refreshToken)

        const tokenData = await jwtService.getTokenData(refreshToken, SETTINGS.REFRESH_SECRET)

        const newAccessToken = await jwtService.createJWT(req.userId!)
        const newRefreshToken = await jwtService.updateRT(req.userId!, tokenData!.deviceId)

        await this.sessionService.updateTokenDate(newRefreshToken)

        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        res.status(HTTP_STATUSES.OK_200).json({accessToken: newAccessToken})
    }

    async registration (req: Request<any, any, UserInputModel>, res: Response<OutputErrorsType>) {
        const result = await this.authService.registration(req.body.login, req.body.email, req.body.password)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async registerConfirmation(req: Request<any, any, RegisterConfCodeModel>, res: Response<OutputErrorsType>) {
        const result = await this.authService.registerConfirmation(req.body.code)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async registerEmailResending(req: Request<any, any, EmailInputModel>, res: Response<OutputErrorsType>) {
        const result = await this.authService.registerEmailResending(req.body.email)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        await blacklistService.addToken(req.cookies.refreshToken)

        const tokenData = await jwtService.getTokenData(refreshToken, SETTINGS.REFRESH_SECRET)
        await this.sessionService.terminateSessionByDeviceId(req.userId!, tokenData!.deviceId)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async getUserInfo(req: Request, res: Response<MeViewModel>){
        const userInfo = await this.authService.getMyInfo(req.userId!);
        res.status(HTTP_STATUSES.OK_200).json(userInfo!)
    }
}