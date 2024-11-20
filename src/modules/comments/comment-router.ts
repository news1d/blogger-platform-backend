import {Router} from "express";
import {accessTokenMiddleware} from "../../middlewares/authorization-middleware";
import {commentController} from "./comment-controller";
import {
    commentContentValidator,
    commentIdValidator,
    idValidator
} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";


export const commentRouter = Router()

commentRouter.get('/:id',
    idValidator,
    errorsResultMiddleware,
    commentController.getCommentById)
commentRouter.put('/:commentId', accessTokenMiddleware,
    commentIdValidator,
    commentContentValidator,
    errorsResultMiddleware,
    commentController.updateCommentById)
commentRouter.delete('/:commentId', accessTokenMiddleware,
    commentIdValidator,
    errorsResultMiddleware,
    commentController.deleteCommentById);