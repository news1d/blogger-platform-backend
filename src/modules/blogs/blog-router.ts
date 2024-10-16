import {Router} from "express";
import {blogRepository} from "./blog-repository";
import {blogController} from "./blog-controller";

export const blogRouter = Router();

blogRouter.get('/', blogController.getBlogs);
blogRouter.post('/', blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    blogController.createBlog);
blogRouter.get('/:id',blogController.getBlogById)

