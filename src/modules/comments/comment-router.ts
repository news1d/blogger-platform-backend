import {Router} from "express";
import {accessTokenMiddleware} from "../../middlewares/authorization-middleware";
import {
    commentContentValidator,
    commentIdValidator,
    idValidator
} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {commentController} from "../../composition-root";


export const commentRouter = Router()

commentRouter.get('/:id',
    idValidator,
    errorsResultMiddleware,
    commentController.getCommentById.bind(commentController))
commentRouter.put('/:commentId', accessTokenMiddleware,
    commentIdValidator,
    commentContentValidator,
    errorsResultMiddleware,
    commentController.updateCommentById.bind(commentController))
commentRouter.delete('/:commentId', accessTokenMiddleware,
    commentIdValidator,
    errorsResultMiddleware,
    commentController.deleteCommentById.bind(commentController));