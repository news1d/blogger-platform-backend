import {config} from 'dotenv';
config()

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    ADMIN_AUTH: 'admin:qwerty',
    PATH: {
        BLOGS: '/hometask_03/api/blogs',
        POSTS: '/hometask_03/api/posts',
        TESTING: '/hometask_03/api/testing',
    },
    COLLECTION_NAME: {
        BLOG: 'blogs',
        POST: 'posts',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: process.env.DB_NAME || ''
}