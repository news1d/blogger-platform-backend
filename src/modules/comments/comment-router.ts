import {Router} from "express";
import {accessTokenMiddleware} from "../../middlewares/authorization-middleware";
import {commentController} from "./comment-controller";
import {commentContentValidator} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";


export const commentRouter = Router()

commentRouter.get('/:id', commentController.getCommentById)
commentRouter.put('/:commentId', accessTokenMiddleware,
    commentContentValidator,
    errorsResultMiddleware,
    commentController.updateCommentById)
commentRouter.delete('/:commentId', accessTokenMiddleware,
    commentController.deleteCommentById);