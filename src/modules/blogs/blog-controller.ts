import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {BlogInputModel, BlogViewModel} from "../../types/blog.types";
import {blogService} from "./blog-service";
import {paginationQueries} from "../../helpers/paginations_values";
import {PostInputModel, PostViewModel} from "../../types/post.types";


export const blogController = {
    async getBlogs (req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const blogs = await blogService.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);

        res.status(HTTP_STATUSES.OK_200).json(blogs)
    },
    async createBlog (req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel | null>) {
        const blogId = await blogService.createBlog(req.body);
        const blog = await blogService.getBlogById(blogId);

        res.status(HTTP_STATUSES.CREATED_201).json(blog);
    },
    async getPostsByBlogId (req: Request<{blogId: string}>, res: Response) {
        const blog = await blogService.getBlogById(req.params.blogId);

        if (blog) {
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req);
            const posts = await blogService.getPostsByBlogId(req.params.blogId, pageNumber, pageSize, sortBy, sortDirection);
            res.status(HTTP_STATUSES.OK_200).json(posts);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async createPostByBlogId(req: Request<{blogId: string}, any, Omit<PostInputModel, 'blogId'>>, res: Response<PostViewModel | null>) {
        const postId = await blogService.createPostsByBlogId(req.params.blogId, req.body)

        if (postId) {
            const post = await blogService.getPostById(postId)
            res.status(HTTP_STATUSES.CREATED_201).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async getBlogById (req: Request<{id: string}>, res: Response<BlogViewModel>) {
        const blog = await blogService.getBlogById(req.params.id);

        if (blog) {
            res.status(HTTP_STATUSES.OK_200).json(blog);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async updateBlogById (req: Request<{id: string}, any, BlogInputModel>, res: Response) {
        const isUpdated = await blogService.updateBlogById(req.params.id, req.body);

        if (isUpdated){
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async deleteBlogById (req: Request<{id: string}>, res: Response) {
        const isDeleted = await blogService.deleteBlogById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}