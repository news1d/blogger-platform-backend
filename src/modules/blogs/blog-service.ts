import {BlogDBType, BlogInputModel} from "../../types/blog.types";
import {PostDBType, PostInputModel} from "../../types/post.types";
import {PostRepository} from "../posts/post-repository";
import {BlogRepository} from "./blog-repository";
import {inject, injectable} from "inversify";

@injectable()
export class BlogService {
    constructor(@inject(BlogRepository) protected blogRepository: BlogRepository,
                @inject(PostRepository) protected postRepository: PostRepository) {}

    async createBlog(body: BlogInputModel): Promise<string> {
        const blog: BlogDBType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
        return await this.blogRepository.createBlog(blog)
    }

    async createPostsByBlogId(blogId: string, blogName: string, body: Omit<PostInputModel, 'blogId'>): Promise<string> {
        const post: PostDBType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
            likes: [],
            likesCount: 0,
            dislikesCount: 0,
        }

        return await this.postRepository.createPost(post)
    }

    async updateBlogById(id: string, body: BlogInputModel): Promise<boolean>{
        return await this.blogRepository.updateBlogById(id, body)
    }

    async deleteBlogById(id: string): Promise<boolean>{
        return await this.blogRepository.deleteBlogById(id)
    }
}