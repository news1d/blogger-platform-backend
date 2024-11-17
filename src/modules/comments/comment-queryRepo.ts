import {CommentDBType, CommentViewModel} from "../../types/comments.types";
import {commentCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";

export const commentQueryRepo = {
    async getCommentsForPost(pageNumber: number,
                             pageSize: number,
                             sortBy: string,
                             sortDirection: 'asc' | 'desc',
                             postId: string): Promise<CommentViewModel[]> {

        const filter = {
            postId: postId,
        }

        const comments = await commentCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        return comments.map(this.mapToOutput)
    },
    async getCommentsCount(postId: string): Promise<number> {
        const filter = {
            postId: postId,
        }

        return commentCollection.countDocuments(filter)
    },
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await commentCollection.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return null;
        }
        return this.mapToOutput(comment);
    },
    mapToOutput(comment: WithId<CommentDBType>): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        }
    }
}