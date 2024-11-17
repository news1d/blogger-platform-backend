import {CommentDBType, CommentInputModel} from "../../types/comments.types";
import {commentCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";

export const commentRepository = {
    async createComment(comment: CommentDBType): Promise<string> {
        const result = await commentCollection.insertOne(comment);
        return result.insertedId.toString();
    },
    async getUserIdByCommentId(commentId: string): Promise<string | null> {
        const comment = await commentCollection.findOne({_id: new ObjectId(commentId)});
        if (!comment) {
            return null;
        }
        return comment.commentatorInfo.userId
    },
    async updateCommentById(commentId: string, body: CommentInputModel): Promise<boolean> {
        const result = await commentCollection.updateOne({_id: new ObjectId(commentId)}, {$set: {
            content: body.content,
            }})

        return result.matchedCount === 1;
    },
    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({_id: new ObjectId(commentId)});
        return result.deletedCount === 1;
    },
}