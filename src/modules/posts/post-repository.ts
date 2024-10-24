import {PostInputModel, PostViewModel} from "../../types/post.types";
import {blogRepository} from "../blogs/blog-repository";
import {postCollection} from "../../db/mongoDb";


export const postRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        return postCollection.find({}).toArray();
    },
    async createPost(body: PostInputModel): Promise<string>{
        const blog = await blogRepository.getBlogById(body.blogId)
        const post: PostViewModel = {
            id: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }
        await postCollection.insertOne(post);
        return post.id;
    },
    async getPostById(id: string): Promise<PostViewModel | null> {
        return await postCollection.findOne({id: id});
    },
    async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
        const blog = await blogRepository.getBlogById(body.blogId)

        const result = await postCollection.updateOne({id: id}, {$set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blog!.name
            }})

        return result.matchedCount === 1;
    },
    async deletePostById(id: string): Promise<boolean>{
        const result = await postCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    }
}