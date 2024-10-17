import {db} from "../../db/db";
import {BlogInputModel, BlogViewModel} from "../../types/blog.types";


export const blogRepository = {
    getBlogs() {
        return db.blogs
    },
    createBlog(body: BlogInputModel){
        const blog: BlogViewModel = {
            id: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }
        db.blogs.push(blog);
        return blog.id
    },
    getBlogById(id: string){
        return db.blogs.find(blog => blog.id === id)
    },
    updateBlogById(id: string, body: BlogInputModel){
        const blog = db.blogs.find(blog => blog.id === id)

        if (blog) {
            blog.name = body.name;
            blog.description = body.description;
            blog.websiteUrl = body.websiteUrl;
            return true;
        } else {
            return false;
        }
    },
    deleteBlogById(id: string){
        const blogIndex = db.blogs.findIndex(blog => blog.id === id)

        if (blogIndex !== -1) {
            db.blogs.splice(blogIndex, 1);
            return true;
        } else {
            return false;
        }
    }
}