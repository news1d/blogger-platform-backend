import {PostDBType, PostInputModel} from "../../types/post.types";
import {postRepository} from "./post-repository";


export const postService = {
    async createPost(blogName: string, body: PostInputModel): Promise<string>{
        const post: PostDBType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
        return await postRepository.createPost(post);
    },
    async updatePostById(id: string, blogName: string, body: PostInputModel): Promise<boolean> {
        return await postRepository.updatePostById(id, blogName, body);
    },
    async deletePostById(id: string): Promise<boolean>{
        return await postRepository.deletePostById(id)
    },
}