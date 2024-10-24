import {Request, Response} from 'express';
import {postRepository} from "./post-repository";
import {HTTP_STATUSES} from "../../http-statuses";
import {PostInputModel, PostViewModel} from "../../types/post.types"


export const postController = {
    async getPosts (req: Request, res: Response<PostViewModel[]>) {
        const posts = await postRepository.getPosts();
        res.status(HTTP_STATUSES.OK_200).json(posts);
    },
    async createPost (req: Request<any, any, PostInputModel>, res: Response<PostViewModel | null>) {
        const postId = await postRepository.createPost(req.body);
        const post = await postRepository.getPostById(postId);

        res.status(HTTP_STATUSES.CREATED_201).json(post);
    },
    async getPostById (req: Request<{id: string}>, res: Response<PostViewModel>) {
        const post = await postRepository.getPostById(req.params.id);

        if (post) {
            res.status(HTTP_STATUSES.OK_200).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async updatePostById (req: Request<{id: string}, any, PostInputModel>, res: Response) {
        const isUpdated = await postRepository.updatePostById(req.params.id, req.body);

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async deletePostById (req: Request, res: Response) {
        const isDeleted = await postRepository.deletePostById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}