import {PostDBType, PostViewModel} from "../../types/post.types";
import {ObjectId, WithId} from "mongodb";
import {PostModel} from "../../entities/post.entity";


export class PostQueryRepo {
    async getPosts(pageNumber: number,
                   pageSize: number,
                   sortBy: string,
                   sortDirection: 'asc' | 'desc',
                   blogId?: string): Promise<PostViewModel[]> {

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

        return posts.map(this.mapToOutput)
    }

    async getPostsCount(blogId?: string): Promise<number> {
        const filter: any = {}

        if (blogId) {
            filter.blogId = blogId ;
        }

        return PostModel.countDocuments(filter)
    }

    async getPostById(id: string): Promise<PostViewModel | null> {
        const post = await PostModel.findOne({_id: new ObjectId(id)});
        if (!post) {
            return null;
        }
        return this.mapToOutput(post);
    }

    mapToOutput(post: WithId<PostDBType>): PostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
    }
}