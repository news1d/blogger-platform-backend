import {Request, Response} from 'express';
import {blogRepository} from "./blog-repository";
import {HTTP_STATUSES} from "../../http-statuses";
import {FieldError} from "../../types/output-errors.type";


export const blogController = {
    getBlogs (req: Request, res: Response) {
        const blogs = blogRepository.getBlogs();
        res.status(HTTP_STATUSES.OK_200).json(blogs)
    },
    createBlog (req: Request, res: Response) {

        // ТУТ НУЖНА АВТОРИЗАЦИЯ

        const errors : FieldError[] = [];

        // nameFieldValidator(name, errors)
        // descriptionFieldValidator(description, errors)
        // websiteUrlFieldValidator(websiteUrl, errors)

        if (errors.length > 0) {
            // const firstError = errorResponse(errors)
            // res.status(HTTP_STATUSES.BAD_REQUEST_400).json(firstError);
            return;
        }

        const blogId = blogRepository.createBlog(req.body);
        const blog = blogRepository.getBlogById(blogId);

        res.status(HTTP_STATUSES.CREATED_201).json(blog);
        return
    },
    getBlogById (req: Request, res: Response) {
        const blog = blogRepository.getBlogById(req.params.id);

        if (blog) {
            res.status(HTTP_STATUSES.OK_200).json(blog);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    },
    updateBlogById (req: Request, res: Response) {
        const isUpdated = blogRepository.updateBlogById(req.params.id, req.body);

        if (isUpdated){
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        const errors : FieldError[] = [];

        // ТУТ ВСЯКИЕ ПРОВЕРКИ АВТОРИЗАЦИЮ И Т.Д.


        res.status(HTTP_STATUSES.NO_CONTENT_204)

    },
    deleteBlogById (req: Request, res: Response) {
        const isDeleted = blogRepository.deleteBlogById(req.params.id);

        // ТУТ НУЖНА АВТОРИЗАЦИЯ

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

}