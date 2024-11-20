import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {PostInputModel, PostViewModel} from "../../types/post.types"
import {postService} from "./post-service";
import {paginationQueries} from "../../helpers/paginations-values";
import {postQueryRepo} from "./post-queryRepo";
import {blogQueryRepo} from "../blogs/blog-queryRepo";
import {CommentInputModel, CommentViewModel} from "../../types/comments.types";
import {commentQueryRepo} from "../comments/comment-queryRepo";


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
        const post = await postQueryRepo.getPostById(req.params.id);

        if (post) {
            res.status(HTTP_STATUSES.OK_200).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async updatePostById (req: Request<{id: string}, any, PostInputModel>, res: Response) {
        const blog = await blogQueryRepo.getBlogById(req.body.blogId)
        const blogName = blog!.name

        const isUpdated = await postService.updatePostById(req.params.id, blogName, req.body);

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async deletePostById (req: Request<{id: string}>, res: Response) {
        const isDeleted = await postService.deletePostById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async getCommentsByPostId (req: Request<{postId: string}>, res: Response) {
        const post = await postQueryRepo.getPostById(req.params.postId);

        if (post) {
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req)
            const comments = await commentQueryRepo.getCommentsForPost(pageNumber, pageSize, sortBy, sortDirection, post.id)
            const commentsCount = await commentQueryRepo.getCommentsCount(post.id)
            res.status(HTTP_STATUSES.OK_200).json({
                pagesCount: Math.ceil(commentsCount/pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: commentsCount,
                items: comments
            });
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async createCommentByPostId(req: Request<{postId: string}, any, CommentInputModel>, res: Response<CommentViewModel | null>) {
        const post = await postQueryRepo.getPostById(req.params.postId);

        if (post) {
            const commentId = await postService.createCommentByPostId(req.params.postId, req.userId!, req.body)
            const comment = await commentQueryRepo.getCommentById(commentId)
            res.status(HTTP_STATUSES.CREATED_201).json(comment)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}