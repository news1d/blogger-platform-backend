import {Router} from "express";
import {accessTokenMiddleware, getAccessTokenMiddleware} from "../../middlewares/authorization-middleware";
import {
    commentContentValidator,
    commentIdValidator, commentLikeStatusValidator,
    idValidator
} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {commentController} from "../../composition-root";


export const commentRouter = Router()

commentRouter.get('/:id',
    getAccessTokenMiddleware,
    idValidator,
    errorsResultMiddleware,
    commentController.getCommentById.bind(commentController))
commentRouter.put('/:commentId', accessTokenMiddleware,
    commentIdValidator,
    commentContentValidator,
    errorsResultMiddleware,
    commentController.updateCommentById.bind(commentController))
commentRouter.put('/:commentId/like-status', accessTokenMiddleware,
    commentIdValidator,
    commentLikeStatusValidator,
    errorsResultMiddleware,
    commentController.updateLikeStatus.bind(commentController))
commentRouter.delete('/:commentId', accessTokenMiddleware,
    commentIdValidator,
    errorsResultMiddleware,
    commentController.deleteCommentById.bind(commentController));