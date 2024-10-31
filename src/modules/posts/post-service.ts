import {PostDBType, PostInputModel, PostViewModel} from "../../types/post.types";
import {blogRepository} from "../blogs/blog-repository";
import {postRepository} from "./post-repository";


export const postService = {
    async getPosts(pageNumber: number,
                   pageSize: number,
                   sortBy: string,
                   sortDirection: 'asc' | 'desc') {

        const posts = await postRepository.getPosts(pageNumber, pageSize, sortBy, sortDirection);
        const postsCount = await postRepository.getPostsCount()

        return {
            pagesCount: Math.ceil(postsCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts,
        }
    },
    async createPost(body: PostInputModel): Promise<string>{
        const blog = await blogRepository.getBlogById(body.blogId)
        const post: PostDBType = {
            _id: undefined,
            id: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }
        return await postRepository.createPost(post);
    },
    async getPostById(id: string): Promise<PostViewModel | null> {
        return postRepository.getPostById(id);
    },
    async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
        return await postRepository.updatePostById(id, body);
    },
    async deletePostById(id: string): Promise<boolean>{
        return await postRepository.deletePostById(id)
    },
}