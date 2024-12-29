import {Router} from "express";
import {container} from "../../composition-root";
import {
    accessTokenMiddleware,
    authMiddleware,
    getAccessTokenMiddleware
} from "../../middlewares/authorization-middleware";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {
    postBlogIdValidator, commentContentValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator, idValidator, postIdValidator
} from "../../validation/express-validator/field-validators";
import {PostController} from "./post-controller";

const postController = container.resolve(PostController);

export const postRouter = Router();

postRouter.get('/', postController.getPosts.bind(postController))
postRouter.post('/', authMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    errorsResultMiddleware,
    postController.createPost.bind(postController));
postRouter.get('/:id',
    idValidator,
    errorsResultMiddleware,
    postController.getPostById.bind(postController));
postRouter.put('/:id', authMiddleware,
    idValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    errorsResultMiddleware,
    postController.updatePostById.bind(postController));
postRouter.delete('/:id', authMiddleware,
    idValidator,
    errorsResultMiddleware,
    postController.deletePostById.bind(postController));

postRouter.get('/:postId/comments',
    getAccessTokenMiddleware,
    postIdValidator,
    errorsResultMiddleware,
    postController.getCommentsByPostId.bind(postController))
postRouter.post('/:postId/comments', accessTokenMiddleware,
    postIdValidator,
    commentContentValidator,
    errorsResultMiddleware,
    postController.createCommentByPostId.bind(postController))