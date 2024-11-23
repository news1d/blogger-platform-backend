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

export const authController = {
    async authentication (req: Request<any, any, LoginInputModel>, res: Response<LoginSuccessViewModel>){
        const result = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return;
        }

        const token = await jwtService.createJWT(result)
        res.status(HTTP_STATUSES.OK_200).json({accessToken: token})
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
    async getUserInfo(req: Request, res: Response<MeViewModel>){
        const userInfo = await authService.getMyInfo(req.userId!);
        res.status(HTTP_STATUSES.OK_200).json(userInfo!)
    }
}