import {commentRepository} from "./comment-repository";
import {CommentInputModel} from "../../types/comments.types";


export const commentService = {
    async updateCommentById(commentId: string, body: CommentInputModel): Promise<boolean>{
        return await commentRepository.updateCommentById(commentId, body);
    },
    async ownerVerification(commentId: string, userId: string): Promise<boolean | null> {
        const receivedUserId = await commentRepository.getUserIdByCommentId(commentId)
        if (receivedUserId === null) {
            return null;
        }
        return receivedUserId === userId;
    },
    async deleteCommentById(commentId: string): Promise<boolean> {
        return await commentRepository.deleteCommentById(commentId)
    }
}