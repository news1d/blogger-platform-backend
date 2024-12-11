import {Router} from "express";
import {authController} from "./auth-controller";
import {
    userEmailValidator,
    userloginOrEmailValidator,
    userLoginValidator,
    userPasswordValidator
} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {accessTokenMiddleware, refreshTokenMiddleware} from "../../middlewares/authorization-middleware";
import {rateLimitMiddleware} from "../../middlewares/rate-limit-middleware";


export const authRouter = Router();

authRouter.post('/login', userloginOrEmailValidator,
    userPasswordValidator,
    errorsResultMiddleware,
    rateLimitMiddleware,
    authController.login)
authRouter.post('/refresh-token', refreshTokenMiddleware,
    authController.refreshToken)
authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    authController.registerConfirmation)
authRouter.post('/registration',
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
    errorsResultMiddleware,
    rateLimitMiddleware,
    authController.registration)
authRouter.post('/registration-email-resending',
    userEmailValidator,
    rateLimitMiddleware,
    authController.registerEmailResending)
authRouter.post('/logout', refreshTokenMiddleware,
    authController.logout)
authRouter.get('/me', accessTokenMiddleware,
    authController.getUserInfo)
