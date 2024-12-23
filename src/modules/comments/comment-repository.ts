import {CommentDBType, CommentInputModel} from "../../types/comments.types";
import {ObjectId} from "mongodb";
import {CommentModel} from "../../entities/comment.entity";

export class CommentRepository {
    async createComment(comment: CommentDBType): Promise<string> {
        const result = await CommentModel.create(comment);
        return result._id.toString();
    }

    async getUserIdByCommentId(commentId: string): Promise<string | null> {
        const comment = await CommentModel.findOne({_id: new ObjectId(commentId)});
        if (!comment) {
            return null;
        }
        return comment.commentatorInfo.userId
    }

    async updateCommentById(commentId: string, body: CommentInputModel): Promise<boolean> {
        const result = await CommentModel.updateOne({_id: new ObjectId(commentId)}, {$set: {
            content: body.content,
            }})

        return result.matchedCount === 1;
    }

    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id: new ObjectId(commentId)});
        return result.deletedCount === 1;
    }
}