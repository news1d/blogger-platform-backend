import {PostDBType, PostInputModel} from "../../types/post.types";
import {CommentDBType, CommentInputModel} from "../../types/comments.types";
import {UserRepository} from "../users/user-repository";
import {PostRepository} from "./post-repository";
import {CommentRepository} from "../comments/comment-repository";
import {inject, injectable} from "inversify";

@injectable()
export class PostService {
    constructor(@inject(PostRepository) protected postRepository: PostRepository,
                @inject(UserRepository) protected userRepository: UserRepository,
                @inject(CommentRepository) protected commentRepository: CommentRepository) {}

    async createPost(blogName: string, body: PostInputModel): Promise<string>{
        const post: PostDBType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
        return await this.postRepository.createPost(post);
    }

    async createCommentByPostId(postId: string, userId: string, body: CommentInputModel): Promise<string> {
        const user = await this.userRepository.getUserById(userId);

        const comment: CommentDBType = {
            content: body.content,
            commentatorInfo: {
                userId: user!._id.toString(),
                userLogin: user!.login
            },
            createdAt: new Date().toISOString(),
            postId: postId,
            likes: [],
            likesCount: 0,
            dislikesCount: 0
        }

        return await this.commentRepository.createComment(comment);

    }

    async updatePostById(id: string, blogName: string, body: PostInputModel): Promise<boolean> {
        return await this.postRepository.updatePostById(id, blogName, body);
    }

    async deletePostById(id: string): Promise<boolean>{
        return await this.postRepository.deletePostById(id)
    }
}