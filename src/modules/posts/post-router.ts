import {Router} from "express";
import {postController} from "./post-controller";
import {accessTokenMiddleware, authMiddleware} from "../../middlewares/authorization-middleware";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {
    postBlogIdValidator, commentContentValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../../validation/express-validator/field-validators";

export const postRouter = Router();

postRouter.get('/', postController.getPosts)
postRouter.post('/', authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    errorsResultMiddleware,
    postController.createPost);
postRouter.get('/:id', postController.getPostById);
postRouter.put('/:id', authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    errorsResultMiddleware,
    postController.updatePostById);
postRouter.delete('/:id', authMiddleware,
    postController.deletePostById);

postRouter.get('/:postId/comments', postController.getCommentsByPostId)
postRouter.post('/:postId/comments', accessTokenMiddleware,
    commentContentValidator,
    errorsResultMiddleware,
    postController.createCommentByPostId)