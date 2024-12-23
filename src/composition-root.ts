import {UserRepository} from "./modules/users/user-repository";
import {UserService} from "./modules/users/user-service";
import {UserController} from "./modules/users/user-controller";
import {UserQueryRepo} from "./modules/users/user-queryRepo";
import {AuthService} from "./modules/auth/auth-service";
import {AuthController} from "./modules/auth/auth-controller";
import {PostRepository} from "./modules/posts/post-repository";
import {PostQueryRepo} from "./modules/posts/post-queryRepo";
import {PostService} from "./modules/posts/post-service";
import {PostController} from "./modules/posts/post-controller";
import {BlogRepository} from "./modules/blogs/blog-repository";
import {BlogQueryRepo} from "./modules/blogs/blog-queryRepo";
import {BlogService} from "./modules/blogs/blog-service";
import {BlogController} from "./modules/blogs/blog-controller";
import {CommentRepository} from "./modules/comments/comment-repository";
import {CommentQueryRepo} from "./modules/comments/comment-queryRepo";
import {CommentService} from "./modules/comments/comment-service";
import {CommentController} from "./modules/comments/comment-controller";
import {SessionRepository} from "./modules/sessions/session-repository";
import {SessionQueryRepo} from "./modules/sessions/session-queryRepo";
import {SessionService} from "./modules/sessions/session-service";
import {SessionController} from "./modules/sessions/session-controller";
import {TestingRepository} from "./modules/testing/testing-repository";
import {TestingController} from "./modules/testing/testing-controller";


const blogRepository = new BlogRepository();
export const blogQueryRepo = new BlogQueryRepo();
const postRepository = new PostRepository();
const postQueryRepo = new PostQueryRepo();
const userRepository = new UserRepository();
const userQueryRepo = new UserQueryRepo();
const commentRepository = new CommentRepository();
const commentQueryRepo = new CommentQueryRepo();
const sessionRepository = new SessionRepository();
const sessionQueryRepo = new SessionQueryRepo();
const testingRepository = new TestingRepository();

const blogService = new BlogService(blogRepository, postRepository);
const postService = new PostService(postRepository, userRepository, commentRepository);
export const userService = new UserService(userRepository);
export const authService = new AuthService(userRepository, userService);
const commentService = new CommentService(commentRepository)
export const sessionService = new SessionService(sessionRepository);

export const blogController = new BlogController(blogService, blogQueryRepo, postQueryRepo)
export const postController = new PostController(postService, postQueryRepo, blogQueryRepo, commentQueryRepo);
export const userController = new UserController(userService, userQueryRepo);
export const authController = new AuthController(authService, userService, sessionService);
export const commentController = new CommentController(commentService, commentQueryRepo);
export const sessionController = new SessionController(sessionService, sessionQueryRepo);
export const testingController = new TestingController(testingRepository)