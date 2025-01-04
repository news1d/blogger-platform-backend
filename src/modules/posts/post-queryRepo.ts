import {PostDBType, PostViewModel} from "../../types/post.types";
import {ObjectId, WithId} from "mongodb";
import {PostModel} from "../../entities/post.entity";
import {injectable} from "inversify";
import {LikeStatus} from "../../types/like.types";

@injectable()
export class PostQueryRepo {
    async getPosts(pageNumber: number,
                   pageSize: number,
                   sortBy: string,
                   sortDirection: 'asc' | 'desc',
                   blogId?: string,
                   userId?: string | null): Promise<PostViewModel[]> {

        const filter: any = {}

        if (blogId) {
            filter.blogId = blogId ;
        }

        const posts = await PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        return posts.map(post => this.mapToOutput(post, userId))
    }

    async getPostsCount(blogId?: string): Promise<number> {
        const filter: any = {}

        if (blogId) {
            filter.blogId = blogId ;
        }

        return PostModel.countDocuments(filter)
    }

    async getPostById(id: string, userId?: string | null): Promise<PostViewModel | null> {
        const post = await PostModel.findOne({_id: new ObjectId(id)});
        if (!post) {
            return null;
        }
        return this.mapToOutput(post, userId);
    }

    mapToOutput(post: WithId<PostDBType>, userId?: string | null): PostViewModel {
        const myStatus = userId
            ? post.likes.find(like => like.userId === userId)?.status || LikeStatus.None
            : LikeStatus.None;

        // Сортировка лайков по дате создания и выбор трёх последних
        const newestLikesArray = post.likes
            .filter(like => like.status === LikeStatus.Like)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
            .slice(0, 3)
            .map(like => ({
                addedAt: like.addedAt.toISOString(),
                userId: like.userId,
                login: like.login
            }));

        const newestLikes = newestLikesArray.length > 0 ? newestLikesArray : null;

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likesCount,
                dislikesCount: post.dislikesCount,
                myStatus: myStatus,
                newestLikes: newestLikes,
            }
        }
    }
}