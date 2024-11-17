import {config} from 'dotenv';
config()

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    ADMIN_AUTH: 'admin:qwerty',
    PATH: {
        BLOGS: '/api/blogs',
        POSTS: '/api/posts',
        TESTING: '/api/testing',
        USERS: '/api/users',
        AUTH: '/api/auth',
        COMMENTS: '/api/comments',
    },
    COLLECTION_NAME: {
        BLOG: 'blogs',
        POST: 'posts',
        USER: 'users',
        COMMENT: 'comments'
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: process.env.DB_NAME || '',
    JWT_SECRET: process.env.JWT_SECRET || '123'
}