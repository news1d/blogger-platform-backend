import {BlogDBType, BlogInputModel, BlogViewModel} from "../../types/blog.types";
import {blogCollection} from "../../db/mongoDb";


export const blogRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        return blogCollection.find({}).toArray();
    },
    async createBlog(body: BlogInputModel): Promise<string> {
        const blog: BlogDBType = {
            _id: undefined,
            id: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        await blogCollection.insertOne(blog);
        return blog.id
    },
    async getBlogById(id: string): Promise<BlogViewModel | null>{
        const blog = await blogCollection.findOne({id: id});
        if (!blog) {
            return null;
        }
        return this.mapToOutput(blog);
    },
    async updateBlogById(id: string, body: BlogInputModel): Promise<boolean>{
        const result = await blogCollection.updateOne({id: id}, {$set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
            }})

        return result.matchedCount === 1;
    },
    async deleteBlogById(id: string): Promise<boolean>{
        const result = await blogCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    mapToOutput(blog: BlogDBType): BlogViewModel {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}