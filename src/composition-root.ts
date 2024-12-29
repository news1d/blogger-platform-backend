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
import "reflect-metadata";
import {Container} from "inversify";

const objects: any[] = []

// const blogRepository = new BlogRepository();
// objects.push(blogRepository);
// const blogQueryRepo = new BlogQueryRepo();
// objects.push(blogQueryRepo);
// const postRepository = new PostRepository();
// objects.push(postRepository);
// const postQueryRepo = new PostQueryRepo();
// objects.push(postQueryRepo);
// const userRepository = new UserRepository();
// objects.push(userRepository);
// const userQueryRepo = new UserQueryRepo();
// objects.push(userQueryRepo);
// const commentRepository = new CommentRepository();
// objects.push(commentRepository);
// const commentQueryRepo = new CommentQueryRepo();
// objects.push(commentQueryRepo);
// const sessionRepository = new SessionRepository();
// objects.push(sessionRepository);
// const sessionQueryRepo = new SessionQueryRepo();
// objects.push(sessionQueryRepo);
// const testingRepository = new TestingRepository();
// objects.push(testingRepository);

// const blogService = new BlogService(blogRepository, postRepository);
// const postService = new PostService(postRepository, userRepository, commentRepository);
// const userService = new UserService(userRepository);
// const authService = new AuthService(userRepository, userService);
// const commentService = new CommentService(commentRepository)
// const sessionService = new SessionService(sessionRepository);

// const blogService = new BlogService(blogRepository, postRepository);
// objects.push(blogService);
// const postService = new PostService(postRepository, userRepository, commentRepository);
// objects.push(postService);
// const userService = new UserService(userRepository);
// objects.push(userService);
// const authService = new AuthService(userRepository, userService);
// objects.push(authService);
// const commentService = new CommentService(commentRepository);
// objects.push(commentService);
// const sessionService = new SessionService(sessionRepository);
// objects.push(sessionService);

// const blogController = new BlogController(blogService, blogQueryRepo, postQueryRepo)
// const postController = new PostController(postService, postQueryRepo, blogQueryRepo, commentQueryRepo);
// const userController = new UserController(userService, userQueryRepo);
// const authController = new AuthController(authService, userService, sessionService);
// const commentController = new CommentController(commentService, commentQueryRepo);
// const sessionController = new SessionController(sessionService, sessionQueryRepo);
// const testingController = new TestingController(testingRepository)

export const container = new Container()

container.bind(BlogController).to(BlogController)
container.bind(BlogService).to(BlogService)
container.bind(BlogRepository).to(BlogRepository)
container.bind(BlogQueryRepo).to(BlogQueryRepo)

container.bind(PostController).to(PostController)
container.bind(PostService).to(PostService)
container.bind(PostRepository).to(PostRepository)
container.bind(PostQueryRepo).to(PostQueryRepo)

container.bind(UserController).to(UserController)
container.bind(UserService).to(UserService)
container.bind(UserRepository).to(UserRepository)
container.bind(UserQueryRepo).to(UserQueryRepo)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)

container.bind(CommentController).to(CommentController)
container.bind(CommentService).to(CommentService)
container.bind(CommentRepository).to(CommentRepository)
container.bind(CommentQueryRepo).to(CommentQueryRepo)

container.bind(SessionController).to(SessionController)
container.bind(SessionService).to(SessionService)
container.bind(SessionRepository).to(SessionRepository)
container.bind(SessionQueryRepo).to(SessionQueryRepo)

container.bind(TestingController).to(TestingController)
container.bind(TestingRepository).to(TestingRepository)