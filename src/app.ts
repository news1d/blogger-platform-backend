import express from 'express';
import cors from 'cors';
import {SETTINGS} from "./settings";
import {blogRouter} from "./modules/blogs/blog-router";
import {postRouter} from "./modules/posts/post-router";

export const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter);