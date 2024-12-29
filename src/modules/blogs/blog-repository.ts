import {BlogDBType, BlogInputModel} from "../../types/blog.types";
import {ObjectId} from "mongodb";
import {BlogModel} from "../../entities/blog.entity";
import {injectable} from "inversify";

@injectable()
export class BlogRepository {
    async createBlog(blog: BlogDBType): Promise<string> {
        const result = await BlogModel.create(blog);
        return result._id.toString();
    }

    async updateBlogById(id: string, body: BlogInputModel): Promise<boolean>{
        const result = await BlogModel.updateOne({_id: new ObjectId(id)}, {$set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
            }})

        return result.matchedCount === 1;
    }

    async deleteBlogById(id: string): Promise<boolean>{
        const result = await BlogModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }
}