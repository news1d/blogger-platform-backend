import {body} from "express-validator";
import {blogRepository} from "../../modules/blogs/blog-repository";


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
    .withMessage('Description should contain 3-100 characters.')

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
    .custom(blogId => {
        const blog = blogRepository.getBlogById(blogId)
        return !!blog // Вернет true, если блог существует, и false, если не найден.
    })
    .withMessage('Blog ID was not found.')