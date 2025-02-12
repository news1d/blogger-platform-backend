import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {PostInputModel, PostViewModel} from "../../types/post.types"
import {paginationQueries} from "../../helpers/paginations-values";
import {CommentInputModel, CommentViewModel} from "../../types/comments.types";
import {PostService} from "./post-service";
import {PostQueryRepo} from "./post-queryRepo";
import {BlogQueryRepo} from "../blogs/blog-queryRepo";
import {CommentQueryRepo} from "../comments/comment-queryRepo";
import {inject, injectable} from "inversify";
import {LikeInputModel} from "../../types/like.types";
import {DomainStatusCode} from "../../helpers/domain-status-code";

@injectable()
export class PostController {
    constructor(@inject(PostService) protected postService: PostService,
                @inject(PostQueryRepo) protected postQueryRepo: PostQueryRepo,
                @inject(BlogQueryRepo) protected blogQueryRepo: BlogQueryRepo,
                @inject(CommentQueryRepo) protected commentQueryRepo: CommentQueryRepo) {}

    async getPosts (req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req)
        const posts = await this.postQueryRepo.getPosts(pageNumber, pageSize, sortBy, sortDirection, undefined, req.userId);
        const postsCount = await this.postQueryRepo.getPostsCount()

        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount: Math.ceil(postsCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts
        });
    }

    async createPost (req: Request<any, any, PostInputModel>, res: Response<PostViewModel | null>) {
        const blog = await this.blogQueryRepo.getBlogById(req.body.blogId)
        const blogName = blog!.name

        const postId = await this.postService.createPost(blogName, req.body);
        const post = await this.postQueryRepo.getPostById(postId);

        res.status(HTTP_STATUSES.CREATED_201).json(post);
    }

    async getPostById (req: Request<{id: string}>, res: Response<PostViewModel>) {
        const post = await this.postQueryRepo.getPostById(req.params.id, req.userId);
        if (post) {
            res.status(HTTP_STATUSES.OK_200).json(post);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async updatePostById (req: Request<{id: string}, any, PostInputModel>, res: Response) {
        const blog = await this.blogQueryRepo.getBlogById(req.body.blogId)
        const blogName = blog!.name

        const isUpdated = await this.postService.updatePostById(req.params.id, blogName, req.body);

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async deletePostById (req: Request<{id: string}>, res: Response) {
        const isDeleted = await this.postService.deletePostById(req.params.id);

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async updateLikeStatus(req: Request<{postId: string}, any, LikeInputModel>, res: Response) {
        const result = await this.postService.updateLikeStatus(req.params.postId, req.userId!, req.body.likeStatus)

        if (result.status === DomainStatusCode.NotFound){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (result.status === DomainStatusCode.Success) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }

    async getCommentsByPostId (req: Request<{postId: string}>, res: Response) {
        const post = await this.postQueryRepo.getPostById(req.params.postId, req.userId);

        if (post) {
            const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req)
            const comments = await this.commentQueryRepo.getCommentsForPost(pageNumber, pageSize, sortBy, sortDirection, post.id, req.userId)
            const commentsCount = await this.commentQueryRepo.getCommentsCount(post.id)
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
    }

    async createCommentByPostId(req: Request<{postId: string}, any, CommentInputModel>, res: Response<CommentViewModel | null>) {
        const post = await this.postQueryRepo.getPostById(req.params.postId, req.userId);

        if (post) {
            const commentId = await this.postService.createCommentByPostId(req.params.postId, req.userId!, req.body)
            const comment = await this.commentQueryRepo.getCommentById(commentId)
            res.status(HTTP_STATUSES.CREATED_201).json(comment)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}