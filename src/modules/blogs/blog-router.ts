import {Router} from "express";
import {blogController} from "../../composition-root";
import {
    blogDescriptionValidator, blogIdValidator,
    blogNameValidator,
    blogWebsiteUrlValidator, idValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {authMiddleware} from "../../middlewares/authorization-middleware";
import {validateBlogQueryParams} from "../../validation/express-validator/query-validators";

export const blogRouter = Router();

blogRouter.get('/', validateBlogQueryParams,
    errorsResultMiddleware,
    blogController.getBlogs.bind(blogController));
blogRouter.post('/', authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorsResultMiddleware,
    blogController.createBlog.bind(blogController));
blogRouter.get('/:blogId/posts',
    validateBlogQueryParams,
    blogIdValidator,
    errorsResultMiddleware,
    blogController.getPostsByBlogId.bind(blogController))
blogRouter.post('/:blogId/posts', authMiddleware,
    validateBlogQueryParams,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorsResultMiddleware,
    blogController.createPostByBlogId.bind(blogController))
blogRouter.get('/:id',
    idValidator,
    errorsResultMiddleware,
    blogController.getBlogById.bind(blogController));
blogRouter.put('/:id', authMiddleware,
    idValidator,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorsResultMiddleware,
    blogController.updateBlogById.bind(blogController));
blogRouter.delete('/:id', authMiddleware,
    idValidator,
    errorsResultMiddleware,
    blogController.deleteBlogById.bind(blogController));

