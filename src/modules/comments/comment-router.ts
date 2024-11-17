import {Router} from "express";
import {accessTokenMiddleware} from "../../middlewares/authorization-middleware";
import {commentController} from "./comment-controller";


export const commentRouter = Router()

commentRouter.get('/:id', commentController.getCommentById)
commentRouter.put('/:commentId', accessTokenMiddleware,
    commentController.updateCommentById)
commentRouter.delete('/:commentId', accessTokenMiddleware,
    commentController.deleteCommentById);