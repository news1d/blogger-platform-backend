import {Router} from "express";
import {container} from "../../composition-root";
import {authMiddleware} from "../../middlewares/authorization-middleware";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {validateUserQueryParams} from "../../validation/express-validator/query-validators";
import {
    idValidator,
    userEmailValidator,
    userLoginValidator,
    userPasswordValidator
} from "../../validation/express-validator/field-validators";
import {UserController} from "./user-controller";

const userController = container.resolve(UserController)

export const userRouter = Router()

userRouter.get('/', authMiddleware,
    validateUserQueryParams,
    userController.getUsers.bind(userController))
userRouter.post('/', authMiddleware,
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
    errorsResultMiddleware,
    userController.createUser.bind(userController));
userRouter.delete('/:id', authMiddleware,
    idValidator,
    errorsResultMiddleware,
    userController.deleteUserById.bind(userController))