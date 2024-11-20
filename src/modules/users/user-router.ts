import {Router} from "express";
import {userController} from "./user-controller";
import {authMiddleware} from "../../middlewares/authorization-middleware";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {validateUserQueryParams} from "../../validation/express-validator/query-validators";
import {
    idValidator,
    userEmailValidator,
    userLoginValidator,
    userPasswordValidator
} from "../../validation/express-validator/field-validators";

export const userRouter = Router()

userRouter.get('/', authMiddleware,
    validateUserQueryParams,
    userController.getUsers)
userRouter.post('/', authMiddleware,
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
    errorsResultMiddleware,
    userController.createUser);
userRouter.delete('/:id', authMiddleware,
    idValidator,
    errorsResultMiddleware,
    userController.deleteUserById)