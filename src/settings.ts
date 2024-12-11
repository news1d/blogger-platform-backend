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
        SESSIONS: '/api/security',
    },
    COLLECTION_NAME: {
        BLOG: 'blogs',
        POST: 'posts',
        USER: 'users',
        COMMENT: 'comments',
        BLACKLIST: 'blacklist',
        SESSION: 'session',
        REQUEST: 'request',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: process.env.DB_NAME || '',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    REFRESH_SECRET: process.env.REFRESH_SECRET || '123'
}