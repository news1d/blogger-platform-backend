import {Request, Response} from 'express';
import {commentService} from "./comment-service";
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {CommentInputModel, CommentViewModel} from "../../types/comments.types";
import {commentQueryRepo} from "./comment-queryRepo";
import {DomainStatusCode} from "../../helpers/domain-status-code";


export const commentController = {
    async getCommentById(req: Request<{id: string}>, res: Response<CommentViewModel>) {
        const comment = await commentQueryRepo.getCommentById(req.params.id);

        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return
        }

        res.status(HTTP_STATUSES.OK_200).json(comment);
    },
    async updateCommentById(req: Request<{commentId: string}, any, CommentInputModel>, res: Response) {
        const result = await commentService.updateCommentById(req.params.commentId, req.userId!, req.body)

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
    },
    async deleteCommentById(req: Request<{commentId: string}>, res: Response) {
        const result = await commentService.deleteCommentById(req.params.commentId, req.userId!)

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