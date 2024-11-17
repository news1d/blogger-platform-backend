import {Router} from "express";
import {authController} from "./auth-controller";
import {userloginOrEmailValidator, userPasswordValidator} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {accessTokenMiddleware} from "../../middlewares/authorization-middleware";


export const authRouter = Router();

authRouter.post('/login', userloginOrEmailValidator,
    userPasswordValidator,
    errorsResultMiddleware,
    authController.authentication)
authRouter.get('/me', accessTokenMiddleware,
    authController.getMyInfo)