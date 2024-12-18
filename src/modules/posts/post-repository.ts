import {PostDBType, PostInputModel} from "../../types/post.types";
import {ObjectId} from "mongodb";
import {PostModel} from "../../entities/post.entity";


export const postRepository = {
    async createPost(post: PostDBType): Promise<string>{
        const result = await PostModel.create(post);
        return result._id.toString();
    },
    async updatePostById(id: string, blogName: string, body: PostInputModel): Promise<boolean> {
        const result = await PostModel.updateOne({_id: new ObjectId(id)}, {$set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blogName
            }})

        return result.matchedCount === 1;
    },
    async deletePostById(id: string): Promise<boolean>{
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }
}