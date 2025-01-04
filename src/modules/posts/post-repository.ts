import {PostDBType, PostInputModel} from "../../types/post.types";
import {ObjectId} from "mongodb";
import {PostModel} from "../../entities/post.entity";
import {injectable} from "inversify";
import {LikeStatus} from "../../types/like.types";

@injectable()
export class PostRepository {
    async createPost(post: PostDBType): Promise<string>{
        const result = await PostModel.create(post);
        return result._id.toString();
    }

    async updatePostById(id: string, blogName: string, body: PostInputModel): Promise<boolean> {
        const result = await PostModel.updateOne({_id: new ObjectId(id)}, {$set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blogName
            }})

        return result.matchedCount === 1;
    }

    async deletePostById(id: string): Promise<boolean>{
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async updateLikeStatus(postId: string, userId: string, userLogin: string, likeStatus: LikeStatus): Promise<boolean> {
        const post = await PostModel.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return false;
        }

        const existingLike = post.likes.find((like) => like.userId === userId);

        if (existingLike) {
            // Обновляем существующую запись о лайке
            existingLike.addedAt = new Date();
            existingLike.status = likeStatus;
        } else {
            // Добавляем новую запись о лайке
            post.likes.push({
                addedAt: new Date(),
                status: likeStatus,
                userId: userId,
                login: userLogin,
            });
        }

        await post.save();

        return true;
    }

    async updateLikesCounters(postId: string): Promise<boolean> {
        const post = await PostModel.findById(postId);

        if (!post) {
            return false;
        }

        // Пересчитываем количество лайков и дизлайков
        const likesCount = post.likes.filter((like) => like.status === LikeStatus.Like).length;
        const dislikesCount = post.likes.filter((like) => like.status === LikeStatus.Dislike).length;

        // Обновляем счётчики в документе
        const result = await PostModel.updateOne(
            { _id: new ObjectId(postId) },
            { $set: {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount
                }
            });

        return result.matchedCount === 1;
    }
}