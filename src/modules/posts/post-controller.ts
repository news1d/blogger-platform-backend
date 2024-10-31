import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {PostInputModel, PostViewModel} from "../../types/post.types"
import {postService} from "./post-service";
import {paginationQueries} from "../../helpers/paginations_values";


export const postController = {
    async getPosts (req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req)

        const posts = await postService.getPosts(pageNumber, pageSize, sortBy, sortDirection);
        res.status(HTTP_STATUSES.OK_200).json(posts);
    },
    async createPost (req: Request<any, any, PostInputModel>, res: Response<PostViewModel | null>) {
        const postId = await postService.createPost(req.body);
        const post = await postService.getPostById(postId);

        res.status(HTTP_STATUSES.CREATED_201).json(post);
    },
    async getPostById (req: Request<{id: string}>, res: Response<PostViewModel>) {
        const post = await postService.getPostById(req.params.id);

        if (post) {
            res.status(HTTP_STATUSES.OK_200).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async updatePostById (req: Request<{id: string}, any, PostInputModel>, res: Response) {
        const isUpdated = await postService.updatePostById(req.params.id, req.body);

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async deletePostById (req: Request, res: Response) {
        const isDeleted = await postService.deletePostById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}