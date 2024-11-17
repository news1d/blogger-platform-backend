import {PostDBType, PostInputModel} from "../../types/post.types";
import {postRepository} from "./post-repository";
import {CommentDBType, CommentInputModel} from "../../types/comments.types";
import {userRepository} from "../users/user-repository";
import {commentRepository} from "../comments/comment-repository";


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
    async createCommentByPostId(postId: string, userId: string, body: CommentInputModel): Promise<string> {
        const user = await userRepository.getUserById(userId);

        const comment: CommentDBType = {
            content: body.content,
            commentatorInfo: {
                userId: user!._id.toString(),
                userLogin: user!.login
            },
            createdAt: new Date().toISOString(),
            postId: postId
        }

        return await commentRepository.createComment(comment);

    },
    async updatePostById(id: string, blogName: string, body: PostInputModel): Promise<boolean> {
        return await postRepository.updatePostById(id, blogName, body);
    },
    async deletePostById(id: string): Promise<boolean>{
        return await postRepository.deletePostById(id)
    },
}