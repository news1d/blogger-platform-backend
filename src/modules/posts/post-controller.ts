import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {PostInputModel, PostViewModel} from "../../types/post.types"
import {postService} from "./post-service";
import {paginationQueries} from "../../helpers/paginations_values";
import {postQueryRepo} from "./post-queryRepo";
import {blogQueryRepo} from "../blogs/blog-queryRepo";
import {ObjectId} from "mongodb";


export const postController = {
    async getPosts (req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req)
        const posts = await postQueryRepo.getPosts(pageNumber, pageSize, sortBy, sortDirection);
        const postsCount = await postQueryRepo.getPostsCount()

        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount: Math.ceil(postsCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts
        });
    },
    async createPost (req: Request<any, any, PostInputModel>, res: Response<PostViewModel | null>) {
        const blog = await blogQueryRepo.getBlogById(req.body.blogId)
        const blogName = blog!.name

        const postId = await postService.createPost(blogName, req.body);
        const post = await postQueryRepo.getPostById(postId);

        res.status(HTTP_STATUSES.CREATED_201).json(post);
    },
    async getPostById (req: Request<{id: string}>, res: Response<PostViewModel>) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const post = await postQueryRepo.getPostById(req.params.id);

        if (post) {
            res.status(HTTP_STATUSES.OK_200).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async updatePostById (req: Request<{id: string}, any, PostInputModel>, res: Response) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const blog = await blogQueryRepo.getBlogById(req.body.blogId)
        const blogName = blog!.name

        const isUpdated = await postService.updatePostById(req.params.id, blogName, req.body);

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async deletePostById (req: Request, res: Response) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const isDeleted = await postService.deletePostById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}