import {BlogViewModel} from "../types/blog.types";
import {PostViewModel} from "../types/post.types";

export type DBType = {
    blogs: BlogViewModel[],
    posts: PostViewModel[],
}

export const db: DBType = {
    blogs: [
        {
            id: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            name: 'some name',
            description: 'some description',
            websiteUrl: 'https://backend.com'
        }
    ],
    posts: [],
}

export const clearDB = () => {
    db.blogs = []
    db.posts = []
}