import {Router} from "express";
import {blogController} from "./blog-controller";
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator,
    postBlogIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../../validation/express-validator/field-validators";
import {errorsResultMiddleware} from "../../validation/express-validator/errors-result-middleware";
import {authMiddleware} from "../../middlewares/authorization-middleware";
import {validateQueryParams} from "../../validation/express-validator/query-validators";

export const blogRouter = Router();

blogRouter.get('/', validateQueryParams, blogController.getBlogs);
blogRouter.post('/', authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorsResultMiddleware,
    blogController.createBlog);
blogRouter.get('/:blogId/posts', validateQueryParams,
    blogController.getPostsByBlogId)
blogRouter.post('/:blogId/posts', authMiddleware,
    validateQueryParams,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    errorsResultMiddleware,
    blogController.createPostByBlogId)
blogRouter.get('/:id', blogController.getBlogById);
blogRouter.put('/:id', authMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorsResultMiddleware,
    blogController.updateBlogById);
blogRouter.delete('/:id', authMiddleware,
    blogController.deleteBlogById);

