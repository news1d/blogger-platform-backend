import {body, param} from "express-validator";
import {LikeStatus} from "../../types/like.types";
import {BlogQueryRepo} from "../../modules/blogs/blog-queryRepo";
import {container} from "../../composition-root";

const blogQueryRepo = container.resolve(BlogQueryRepo);

export const idValidator = param('id')
        .isMongoId()
        .withMessage('Invalid ID format.')

export const blogIdValidator = param('blogId')
    .isMongoId()
    .withMessage('Invalid BlogID format.')

export const blogNameValidator = body('name')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a name.')
    .isLength({min: 3, max: 15})
    .withMessage('Name should contain 3-15 characters.')

export const blogDescriptionValidator = body('description')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a description.')
    .isLength({min: 3, max: 500})
    .withMessage('Description should contain 3-500 characters.')

export const blogWebsiteUrlValidator = body('websiteUrl')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a Website URL.')
    .isLength({min: 3, max: 100})
    .withMessage('Website URL should not exceed 100 characters.')
    .matches(/^https:\/\/([a-zA-Z0-9-_]+\.)+[a-zA-Z0-9-_]+(\/[a-zA-Z0-9-_]+)*\/?$/)
    .withMessage('Please enter a valid Website URL.');


export const postIdValidator = param('postId')
    .isMongoId()
    .withMessage('Invalid PostID format.')

export const postTitleValidator = body('title')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a title.')
    .isLength({min: 3, max: 30})
    .withMessage('Title should contain 3-30 characters.')

export const postShortDescriptionValidator = body('shortDescription')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a short description.')
    .isLength({min: 3, max: 100})
    .withMessage('Short description should contain 3-100 characters.')

export const postContentValidator = body('content')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a content.')
    .isLength({min: 3, max: 1000})
    .withMessage('Content should contain 3-1000 characters.')

export const postBlogIdValidator = body('blogId')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a blog ID.')
    .custom(async (blogId) => {
        const blog = await blogQueryRepo.getBlogById(blogId);
        if (!blog) {
            throw new Error('Blog ID was not found.');
        }
        return true;
    });


export const userLoginValidator = body('login')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a login.')
    .isLength({ min: 3, max: 10 })
    .withMessage('Login should contain 3-10 characters.')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Login must contain only letters, numbers, underscores, or hyphens')

export const userPasswordValidator = body('password')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a password.')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password should contain 6-20 characters.')

export const userNewPasswordValidator = body('newPassword')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a password.')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password should contain 6-20 characters.')

export const userEmailValidator = body('email')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a email address.')
    .isEmail()
    .withMessage('Email must be a valid format')

export const userloginOrEmailValidator = body('loginOrEmail')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a login or email.')
    .isLength({ min: 3 })
    .withMessage('Login or email should contain minimum 3 characters.')
    .matches(/^[a-zA-Z0-9@._-]*$/)
    .withMessage('Login or email must contain only letters, numbers, underscores, hyphens, or email format characters.')


export const commentIdValidator = param('commentId')
    .isMongoId()
    .withMessage('Invalid CommentID format.')

export const commentContentValidator = body('content')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a content.')
    .isLength({ min: 20, max: 300 })
    .withMessage('Content should contain 20-300 characters.')

export const likeStatusValidator = body('likeStatus')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('Please enter a like status.')
    .isIn(Object.values(LikeStatus))
    .withMessage(`likeStatus must be one of: ${Object.values(LikeStatus).join(', ')}`);