import {BlogDBType, BlogInputModel, BlogViewModel} from "../../types/blog.types";
import {blogRepository} from "./blog-repository";
import {postRepository} from "../posts/post-repository";
import {PostDBType, PostInputModel, PostViewModel} from "../../types/post.types";


export const blogService = {
    async getBlogs(pageNumber: number,
                   pageSize: number,
                   sortBy: string,
                   sortDirection: 'asc' | 'desc',
                   searchNameTerm: string | null) {

        const blogs = await blogRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
        const blogsCount = await blogRepository.getBlogsCount(searchNameTerm)

        return {
            pagesCount: Math.ceil(blogsCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogsCount,
            items: blogs,
        }
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
        return await blogRepository.createBlog(blog)
    },
    async getPostsByBlogId(blogId: string,
                           pageNumber: number,
                           pageSize: number,
                           sortBy: string,
                           sortDirection: 'asc' | 'desc') {

        const posts = await postRepository.getPosts(pageNumber, pageSize, sortBy, sortDirection, blogId);
        const postsCount = await postRepository.getPostsCount(blogId)

        return {
            pagesCount: Math.ceil(postsCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts,
        }

    },
    async createPostsByBlogId(blogId: string, body: Omit<PostInputModel, 'blogId'>): Promise<string | null> {
        const blog = await blogRepository.getBlogById(blogId);

        if (!blog) {
            return null;
        }

        const post: PostDBType = {
            _id: undefined,
            id: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        return await postRepository.createPost(post)
    },
    async getPostById(id: string): Promise<PostViewModel | null> {
        return postRepository.getPostById(id);
    },
    async getBlogById(id: string): Promise<BlogViewModel | null>{
        return blogRepository.getBlogById(id)
    },
    async updateBlogById(id: string, body: BlogInputModel): Promise<boolean>{
        return await blogRepository.updateBlogById(id, body)
    },
    async deleteBlogById(id: string): Promise<boolean>{
        return await blogRepository.deleteBlogById(id)
    },
}