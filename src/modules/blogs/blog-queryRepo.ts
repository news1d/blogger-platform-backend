import {BlogDBType, BlogViewModel} from "../../types/blog.types";
import {blogCollection} from "../../db/mongoDb";
import { WithId, ObjectId} from "mongodb";

export const blogQueryRepo = {
    async getBlogs(pageNumber: number,
                   pageSize: number,
                   sortBy: string,
                   sortDirection: 'asc' | 'desc',
                   searchNameTerm: string | null): Promise<BlogViewModel[]> {

        const filter: any = {}

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: "i" };
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
            filter.name = { $regex: serchNameTerm, $options: "i" };
        }

        return blogCollection.countDocuments(filter)
    },
    async getBlogById(id: string): Promise<BlogViewModel | null>{
        const blog = await blogCollection.findOne({_id: new ObjectId(id)});

        if (!blog) {
            return null;
        }
        return this.mapToOutput(blog);
    },
    mapToOutput(blog: WithId<BlogDBType>): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}