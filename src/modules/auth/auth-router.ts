import {Router} from "express";
import {authController} from "./auth-controller";
import {
    userEmailValidator, userEmailValidatorWithoutMessage,
    userloginOrEmailValidator,
    userLoginValidator, userNewPasswordValidator,
    userPasswordValidator
} from "../../validation/express-validator/field-validators";
import {
    errorsResultMiddleware,
    errorsResultMiddlewareWithoutMessage
} from "../../validation/express-validator/errors-result-middleware";
import {accessTokenMiddleware, refreshTokenMiddleware} from "../../middlewares/authorization-middleware";
import {rateLimitMiddleware} from "../../middlewares/rate-limit-middleware";


export const authRouter = Router();

authRouter.post('/login', userloginOrEmailValidator,
    userPasswordValidator,
    errorsResultMiddleware,
    rateLimitMiddleware,
    authController.login)
authRouter.post('/password-recovery',
    userEmailValidatorWithoutMessage,
    errorsResultMiddlewareWithoutMessage,
    rateLimitMiddleware,
    authController.passwordRecovery)
authRouter.post('/new-password',
    userNewPasswordValidator,
    errorsResultMiddlewareWithoutMessage,
    rateLimitMiddleware,
    authController.newPassword)
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
