import {PostDBType, PostInputModel} from "../../types/post.types";
import {postCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";


export const postRepository = {
    async createPost(post: PostDBType): Promise<string>{
        const result = await postCollection.insertOne(post);
        return result.insertedId.toString();
    },
    async updatePostById(id: string, blogName: string, body: PostInputModel): Promise<boolean> {
        const result = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blogName
            }})

        return result.matchedCount === 1;
    },
    async deletePostById(id: string): Promise<boolean>{
        const result = await postCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }
}