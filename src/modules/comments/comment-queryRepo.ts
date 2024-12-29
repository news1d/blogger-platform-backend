import {CommentDBType, CommentViewModel} from "../../types/comments.types";
import {ObjectId, WithId} from "mongodb";
import {CommentModel} from "../../entities/comment.entity";
import {LikeStatus} from "../../types/like.types";
import {injectable} from "inversify";

@injectable()
export class CommentQueryRepo {
    async getCommentsForPost(pageNumber: number,
                             pageSize: number,
                             sortBy: string,
                             sortDirection: 'asc' | 'desc',
                             postId: string,
                             userId?: string | null): Promise<CommentViewModel[]> {

        const filter = {
            postId: postId,
        }

        const comments = await CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        return comments.map(comment => this.mapToOutput(comment, userId));
    }

    async getCommentsCount(postId: string): Promise<number> {
        const filter = {
            postId: postId,
        }

        return CommentModel.countDocuments(filter)
    }

    async getCommentById(id: string, userId?: string | null): Promise<CommentViewModel | null> {
        const comment = await CommentModel.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return null;
        }
        return this.mapToOutput(comment, userId);
    }

    mapToOutput(comment: WithId<CommentDBType>, userId?: string | null): CommentViewModel {
        const myStatus = userId
            ? comment.likes.find(like => like.authorId === userId)?.status || LikeStatus.None
            : LikeStatus.None;

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount,
                dislikesCount: comment.dislikesCount,
                myStatus: myStatus
            }
        }
    }
}