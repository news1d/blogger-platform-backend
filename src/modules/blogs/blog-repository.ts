import {BlogInputModel, BlogViewModel} from "../../types/blog.types";
import {blogCollection} from "../../db/mongoDb";


export const blogRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        return blogCollection.find({}).toArray();
    },
    async createBlog(body: BlogInputModel): Promise<string> {
        const blog: BlogViewModel = {
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
        return await blogCollection.findOne({id: id});
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
    }
}