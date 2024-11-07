import {BlogDBType, BlogInputModel} from "../../types/blog.types";
import {blogCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";

export const blogRepository = {
    async createBlog(blog: BlogDBType): Promise<string> {
        const result = await blogCollection.insertOne(blog)
        return result.insertedId.toString();
    },
    async updateBlogById(id: string, body: BlogInputModel): Promise<boolean>{
        const result = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
            }})

        return result.matchedCount === 1;
    },
    async deleteBlogById(id: string): Promise<boolean>{
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }
}