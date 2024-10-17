import {db} from "../../db/db";
import {PostInputModel, PostViewModel} from "../../types/post.type";
import {blogRepository} from "../blogs/blog-repository";

export const postRepository = {
    getPosts() {
        return db.posts
    },
    createPost(body: PostInputModel){
        const post: PostViewModel = {
            id: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogRepository.getBlogById(body.blogId)!.name,
        }
        db.posts.push(post);
        return post.id;
    },
    getPostById(id: string){
        return db.posts.find(post => post.id === id)
    },
    updatePostById(id: string, body: PostInputModel){
        const post = db.posts.find(post => post.id === id)

        if (post) {
            post.title = body.title;
            post.shortDescription = body.shortDescription;
            post.content = body.content;
            post.blogId = body.blogId;
            post.blogName = blogRepository.getBlogById(body.blogId)!.name;
            return true;
        } else {
            return false;
        }
    },
    deletePostById(id: string){
        const postIndex = db.posts.findIndex(blog => blog.id === id)

        if (postIndex !== -1) {
            db.posts.splice(postIndex, 1);
            return true;
        } else {
            return false;
        }
    }
}