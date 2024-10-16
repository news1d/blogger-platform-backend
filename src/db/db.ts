import {BlogViewModel} from "../types/blog.types";
import {PostViewModel} from "../types/post.type";

export type DBType = {
    blogs: BlogViewModel[],
    posts: PostViewModel[],
}

export const db: DBType = {
    blogs: [],
    posts: [],
}

export const clearDB = () => {
    db.blogs = []
    db.posts = []
}