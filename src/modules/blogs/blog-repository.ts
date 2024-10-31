import {BlogDBType, BlogInputModel, BlogViewModel} from "../../types/blog.types";
import {blogCollection} from "../../db/mongoDb";

export const blogRepository = {
    async getBlogs(pageNumber: number,
                   pageSize: number,
                   sortBy: string,
                   sortDirection: 'asc' | 'desc',
                   searchNameTerm: string | null): Promise<BlogViewModel[]> {

        const filter: any = {}

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, options: "i" };
        }

        const blogs = await blogCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        return blogs.map(this.mapToOutput)
    },
    async getBlogsCount(serchNameTerm: string | null): Promise<number> {
        const filter: any = {}

        if (serchNameTerm) {
            filter.name = { $regex: serchNameTerm, options: "i" };
        }

        return blogCollection.countDocuments(filter)
    },
    async createBlog(blog: BlogDBType): Promise<string> {
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