import {Router} from "express";
import {authController} from "../../composition-root";
import {
    userEmailValidator,
    userloginOrEmailValidator,
    userLoginValidator, userNewPasswordValidator,
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
    authController.login.bind(authController))
authRouter.post('/password-recovery',
    userEmailValidator,
    errorsResultMiddleware,
    rateLimitMiddleware,
    authController.passwordRecovery.bind(authController))
authRouter.post('/new-password',
    userNewPasswordValidator,
    errorsResultMiddleware,
    rateLimitMiddleware,
    authController.newPassword.bind(authController))
authRouter.post('/refresh-token', refreshTokenMiddleware,
    authController.refreshToken.bind(authController))
authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    authController.registerConfirmation.bind(authController))
authRouter.post('/registration',
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
    errorsResultMiddleware,
    rateLimitMiddleware,
    authController.registration.bind(authController))
authRouter.post('/registration-email-resending',
    userEmailValidator,
    rateLimitMiddleware,
    authController.registerEmailResending.bind(authController))
authRouter.post('/logout', refreshTokenMiddleware,
    authController.logout.bind(authController))
authRouter.get('/me', accessTokenMiddleware,
    authController.getUserInfo.bind(authController))
