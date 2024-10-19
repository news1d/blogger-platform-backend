import {Request, Response} from 'express';
import {postRepository} from "./post-repository";
import {HTTP_STATUSES} from "../../http-statuses";
import {PostInputModel, PostViewModel} from "../../types/post.types"


export const postController = {
    getPosts (req: Request, res: Response<PostViewModel[]>) {
        const posts = postRepository.getPosts();
        res.status(HTTP_STATUSES.OK_200).json(posts);
    },
    createPost (req: Request<any, any, PostInputModel>, res: Response<PostViewModel>) {
        const postId = postRepository.createPost(req.body);
        const post = postRepository.getPostById(postId);

        res.status(HTTP_STATUSES.CREATED_201).json(post);
    },
    getPostById (req: Request<{id: string}>, res: Response<PostViewModel>) {
        const post = postRepository.getPostById(req.params.id);

        if (post) {
            res.status(HTTP_STATUSES.OK_200).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    updatePostById (req: Request<{id: string}, any, PostInputModel>, res: Response) {
        const isUpdated = postRepository.updatePostById(req.params.id, req.body);

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    deletePostById (req: Request, res: Response) {
        const isDeleted = postRepository.deletePostById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}