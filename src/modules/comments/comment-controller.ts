import {Request, Response} from 'express';
import {commentService} from "./comment-service";
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {CommentInputModel, CommentViewModel} from "../../types/comments.types";
import {commentQueryRepo} from "./comment-queryRepo";


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
        const isOwner = await commentService.ownerVerification(req.params.commentId, req.userId!);

        if (isOwner === null) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (!isOwner) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
            return;
        }

        const isUpdated = await commentService.updateCommentById(req.params.commentId, req.body)

        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    async deleteCommentById(req: Request<{commentId: string}>, res: Response) {
        const isOwner = await commentService.ownerVerification(req.params.commentId, req.userId!);

        if (isOwner === null) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        if (!isOwner) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
            return;
        }

        const isDeleted = await commentService.deleteCommentById(req.params.commentId)

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}