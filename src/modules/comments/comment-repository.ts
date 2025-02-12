import {CommentDBType, CommentInputModel} from "../../types/comments.types";
import {ObjectId} from "mongodb";
import {CommentModel} from "../../entities/comment.entity";
import {LikeStatus} from "../../types/like.types";
import {injectable} from "inversify";

@injectable()
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

    async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<boolean> {
        const comment = await CommentModel.findOne({ _id: new ObjectId(commentId) });

        if (!comment) {
            return false; // Комментарий не найден
        }

        const existingLike = comment.likes.find((like) => like.authorId === userId);

        if (existingLike) {
            // Обновляем существующий лайк
            existingLike.status = likeStatus;
            existingLike.createdAt = new Date();
        } else {
            // Добавляем новый лайк
            comment.likes.push({
                authorId: userId,
                status: likeStatus,
                createdAt: new Date(),
            });
        }

        await comment.save();

        return true;
    }

    async updateLikesCounters(commentId: string): Promise<boolean> {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return false;
        }

        // Пересчитываем количество лайков и дизлайков
        const likesCount = comment.likes.filter((like) => like.status === LikeStatus.Like).length;
        const dislikesCount = comment.likes.filter((like) => like.status === LikeStatus.Dislike).length;

        // Обновляем счётчики в документе
        const result = await CommentModel.updateOne(
            { _id: new ObjectId(commentId) },
            { $set: {
                likesCount: likesCount,
                dislikesCount: dislikesCount
                }
            });

        return result.matchedCount === 1;
    }

    async deleteCommentById(commentId: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id: new ObjectId(commentId)});
        return result.deletedCount === 1;
    }
}