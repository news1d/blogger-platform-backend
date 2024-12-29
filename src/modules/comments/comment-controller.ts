import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {CommentInputModel, CommentViewModel} from "../../types/comments.types";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {CommentService} from "./comment-service";
import {CommentQueryRepo} from "./comment-queryRepo";
import {LikeInputModel} from "../../types/like.types";
import {inject, injectable} from "inversify";

@injectable()
export class CommentController {
    constructor(@inject(CommentService) protected commentService: CommentService,
                @inject(CommentQueryRepo) protected commentQueryRepo: CommentQueryRepo) {}

    async getCommentById(req: Request<{id: string}>, res: Response<CommentViewModel>) {
        const comment = await this.commentQueryRepo.getCommentById(req.params.id, req.userId);

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return
        }

        res.status(HTTP_STATUSES.OK_200).json(comment);
    }

    async updateCommentById(req: Request<{commentId: string}, any, CommentInputModel>, res: Response) {
        const result = await this.commentService.updateCommentById(req.params.commentId, req.userId!, req.body)

        if (result.status === DomainStatusCode.NotFound){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (result.status === DomainStatusCode.Forbidden){
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
            return;
        }

        if (result.status === DomainStatusCode.Success) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }

    async updateLikeStatus(req: Request<{commentId: string}, any, LikeInputModel>, res: Response) {
        const result = await this.commentService.updateLikeStatus(req.params.commentId, req.userId!, req.body.likeStatus)

        if (result.status === DomainStatusCode.NotFound){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (result.status === DomainStatusCode.Success) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }

    async deleteCommentById(req: Request<{commentId: string}>, res: Response) {
        const result = await this.commentService.deleteCommentById(req.params.commentId, req.userId!)

        if (result.status === DomainStatusCode.NotFound){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (result.status === DomainStatusCode.Forbidden){
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
            return;
        }

        if (result.status === DomainStatusCode.Success) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }
}