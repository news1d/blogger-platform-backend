import {commentRepository} from "./comment-repository";
import {CommentInputModel} from "../../types/comments.types";
import {Result} from "../../types/result.types";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {createResult} from "../../helpers/result-function";


export const commentService = {
    async updateCommentById(commentId: string, userId: string, body: CommentInputModel): Promise<Result<null>>{
        const result = await this.ownerVerification(commentId, userId)

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const isUpdated = await commentRepository.updateCommentById(commentId, body);

        if (isUpdated ) {
            return createResult(DomainStatusCode.Success)
        } else {
            return createResult(DomainStatusCode.NotFound)
        }
    },
    async ownerVerification(commentId: string, userId: string): Promise<Result<null>> {
        const receivedUserId = await commentRepository.getUserIdByCommentId(commentId)
        if (receivedUserId === null) {
            return createResult(DomainStatusCode.NotFound)
        }

        if (receivedUserId === userId) {
            return createResult(DomainStatusCode.Success)
        } else {
            return createResult(DomainStatusCode.Forbidden)
        }
    },
    async deleteCommentById(commentId: string, userId: string): Promise<Result<null>> {
        const result = await this.ownerVerification(commentId, userId)

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const isDeleted = await commentRepository.deleteCommentById(commentId)

        if (isDeleted ) {
            return createResult(DomainStatusCode.Success)
        } else {
            return createResult(DomainStatusCode.NotFound)
        }
    }
}