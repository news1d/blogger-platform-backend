import {commentRepository} from "./comment-repository";
import {CommentInputModel} from "../../types/comments.types";
import {Result} from "../../types/result.types";
import {DomainStatusCode} from "../../helpers/domain_status_code";


export const commentService = {
    async updateCommentById(commentId: string, userId: string, body: CommentInputModel): Promise<Result<null>>{
        const result = await this.ownerVerification(commentId, userId)

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const isUpdated = await commentRepository.updateCommentById(commentId, body);

        if (isUpdated ) {
            return {
                status: DomainStatusCode.Success,
                data: null,
                errorsMessages: []
            }
        } else {
                return {
                    status: DomainStatusCode.NotFound,
                    data: null,
                    errorsMessages: []
                }
        }
    },
    async ownerVerification(commentId: string, userId: string): Promise<Result<null>> {
        const receivedUserId = await commentRepository.getUserIdByCommentId(commentId)
        if (receivedUserId === null) {
            return {
                status: DomainStatusCode.NotFound,
                data: null,
                errorsMessages: []
            };
        }

        if (receivedUserId === userId) {
            return {
                status: DomainStatusCode.Success,
                data: null,
                errorsMessages: []
            }
        } else {
            return {
                status: DomainStatusCode.Forbidden,
                data: null,
                errorsMessages: []
            }
        }
    },
    async deleteCommentById(commentId: string, userId: string): Promise<Result<null>> {
        const result = await this.ownerVerification(commentId, userId)

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const isDeleted = await commentRepository.deleteCommentById(commentId)

        if (isDeleted ) {
            return {
                status: DomainStatusCode.Success,
                data: null,
                errorsMessages: []
            }
        } else {
            return {
                status: DomainStatusCode.NotFound,
                data: null,
                errorsMessages: []
            }
        }
    }
}