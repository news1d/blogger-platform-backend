import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {BlogInputModel, BlogViewModel} from "../../types/blog.types";
import {blogService} from "./blog-service";
import {paginationQueries} from "../../helpers/paginations-values";
import {PostInputModel, PostViewModel} from "../../types/post.types";
import {blogQueryRepo} from "./blog-queryRepo";
import {postQueryRepo} from "../posts/post-queryRepo";


export const blogController = {
    async getBlogs (req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req)
        const blogs = await blogQueryRepo.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
        const blogsCount = await blogQueryRepo.getBlogsCount(searchNameTerm)

        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount: Math.ceil(blogsCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogsCount,
            items: blogs
        })
    },
    async createBlog (req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel | null>) {
        const blogId = await blogService.createBlog(req.body);
        const blog = await blogQueryRepo.getBlogById(blogId);

        res.status(HTTP_STATUSES.CREATED_201).json(blog);
    },
    async getPostsByBlogId (req: Request<{blogId: string}>, res: Response) {
        const blogId = req.params.blogId
        const blog = await blogQueryRepo.getBlogById(blogId);

        if (blog) {
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req);
            const posts = await postQueryRepo.getPosts(pageNumber, pageSize, sortBy, sortDirection, blogId);
            const postsCount = await postQueryRepo.getPostsCount(blogId)
            res.status(HTTP_STATUSES.OK_200).json({
                pagesCount: Math.ceil(postsCount/pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: postsCount,
                items: posts,
            });
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async createPostByBlogId(req: Request<{blogId: string}, any, Omit<PostInputModel, 'blogId'>>, res: Response<PostViewModel | null>) {
        const blog = await blogQueryRepo.getBlogById(req.params.blogId);

        if (blog) {
            const blogName = blog.name
            const postId = await blogService.createPostsByBlogId(req.params.blogId, blogName, req.body)
            const post = await postQueryRepo.getPostById(postId)
            res.status(HTTP_STATUSES.CREATED_201).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async getBlogById (req: Request<{id: string}>, res: Response<BlogViewModel>) {
        const blog = await blogQueryRepo.getBlogById(req.params.id);

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