import {config} from 'dotenv';
config()

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    ADMIN_AUTH: 'admin:qwerty',
    PATH: {
        BLOGS: '/ht_02/api/blogs',
        POSTS: '/ht_02/api/posts',
        TESTING: '/ht_02/api/testing',
    }
}