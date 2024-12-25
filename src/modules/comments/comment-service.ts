import {CommentInputModel} from "../../types/comments.types";
import {Result} from "../../types/result.types";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {createResult} from "../../helpers/result-function";
import {CommentRepository} from "./comment-repository";
import {LikeStatus} from "../../types/like.types";


export class CommentService {
    constructor(protected commentRepository: CommentRepository) {}

    async updateCommentById(commentId: string, userId: string, body: CommentInputModel): Promise<Result<null>>{
        const result = await this.ownerVerification(commentId, userId)

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const isUpdated = await this.commentRepository.updateCommentById(commentId, body);

        if (isUpdated ) {
            return createResult(DomainStatusCode.Success)
        } else {
            return createResult(DomainStatusCode.NotFound)
        }
    }

    async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<Result<null>> {
        const isUpdated = await this.commentRepository.updateLikeStatus(commentId, userId, likeStatus)

        if (!isUpdated ) {
            return createResult(DomainStatusCode.NotFound)
        }

        const isRecalculated = await this.commentRepository.updateLikesCounters(commentId)

        if (isRecalculated) {
            return createResult(DomainStatusCode.Success)
        } else {
            return createResult(DomainStatusCode.NotFound)
        }
    }

    async ownerVerification(commentId: string, userId: string): Promise<Result<null>> {
        const receivedUserId = await this.commentRepository.getUserIdByCommentId(commentId)
        if (receivedUserId === null) {
            return createResult(DomainStatusCode.NotFound)
        }

        if (receivedUserId === userId) {
            return createResult(DomainStatusCode.Success)
        } else {
            return createResult(DomainStatusCode.Forbidden)
        }
    }

    async deleteCommentById(commentId: string, userId: string): Promise<Result<null>> {
        const result = await this.ownerVerification(commentId, userId)

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const isDeleted = await this.commentRepository.deleteCommentById(commentId)

        if (isDeleted ) {
            return createResult(DomainStatusCode.Success)
        } else {
            return createResult(DomainStatusCode.NotFound)
        }
    }
}