import {Router} from "express";
import {accessTokenMiddleware} from "../../middlewares/authorization-middleware";
import {commentController} from "./comment-controller";
import {commentContentValidator} from "../../validation/express-validator/field-validators";


export const commentRouter = Router()

commentRouter.get('/:id', commentController.getCommentById)
commentRouter.put('/:commentId', accessTokenMiddleware,
    commentContentValidator,
    commentController.updateCommentById)
commentRouter.delete('/:commentId', accessTokenMiddleware,
    commentController.deleteCommentById);