import express from 'express';
import cors from 'cors';
import {SETTINGS} from "./settings";
import {blogRouter} from "./modules/blogs/blog-router";
import {postRouter} from "./modules/posts/post-router";
import {testingRouter} from "./modules/testing/testing-router";
import {authRouter} from "./modules/auth/auth-router";
import {userRouter} from "./modules/users/user-router";
import {commentRouter} from "./modules/comments/comment-router";
import cookieParser from "cookie-parser";
import {sessionRouter} from "./modules/sessions/session-router";

export const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser())
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({version: '2.1'})
})

app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);
app.use(SETTINGS.PATH.USERS, userRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.COMMENTS, commentRouter);
app.use(SETTINGS.PATH.SESSIONS, sessionRouter);