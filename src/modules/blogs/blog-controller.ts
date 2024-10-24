import {Request, Response} from 'express';
import {blogRepository} from "./blog-repository";
import {HTTP_STATUSES} from "../../http-statuses";
import {BlogInputModel, BlogViewModel} from "../../types/blog.types";


export const blogController = {
    async getBlogs (req: Request, res: Response<BlogViewModel[]>) {
        const blogs = await blogRepository.getBlogs();
        res.status(HTTP_STATUSES.OK_200).json(blogs)
    },
   async createBlog (req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel | null>) {
        const blogId = await blogRepository.createBlog(req.body);
        const blog = await blogRepository.getBlogById(blogId);

        res.status(HTTP_STATUSES.CREATED_201).json(blog);
    },
    async getBlogById (req: Request<{id: string}>, res: Response<BlogViewModel>) {
        const blog = await blogRepository.getBlogById(req.params.id);

        if (blog) {
            res.status(HTTP_STATUSES.OK_200).json(blog);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async updateBlogById (req: Request<{id: string}, any, BlogInputModel>, res: Response) {
        const isUpdated = await blogRepository.updateBlogById(req.params.id, req.body);

        if (isUpdated){
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async deleteBlogById (req: Request<{id: string}>, res: Response) {
        const isDeleted = await blogRepository.deleteBlogById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}