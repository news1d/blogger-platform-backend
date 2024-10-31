import request from 'supertest';
import {SETTINGS} from '../src/settings'
import {app} from "../src/app";
import {clearDB} from "../src/db/mongoDb";
import {HTTP_STATUSES} from "../src/helpers/http-statuses";
import {authData, blogData, blogsTestManager, createPostData, postsTestManager} from "./test-helpers";
import {blogRepository} from "../src/modules/blogs/blog-repository";


describe('/blogs', () => {
    beforeAll(async () => {
        await clearDB();
    })

    it('should return 204 and empty array', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.TESTING}/all-data`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it('should return a paginated list of blogs sorted by name', async () => {
        // Добавляем блоги
        const firstBlog = {
            ...blogData.validData,
            name: 'Timbo blogger'
        }
        const secondBlog = {
            ...blogData.validData,
            name: 'Timon & Pumbaa'
        }

        await blogsTestManager.createBlog(blogData.validData)
        const firstCreateResponse = await blogsTestManager.createBlog(firstBlog)
        const secondCreateResponse = await blogsTestManager.createBlog(secondBlog)
        const firstCreatedBlog = firstCreateResponse.body
        const secondCreatedBlog = secondCreateResponse.body

        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .query({
                pageSize: 5,
                pageNumber: 1,
                searchNameTerm: 'Tim',
                sortDirection: 'asc',
                sortBy: 'name',
            })
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 5,
                totalCount: 2,
                items: [firstCreatedBlog, secondCreatedBlog]
            })
    })

    it('should return all posts for correct blogId', async () => {
        // Добавляем сторонний блог
        await blogsTestManager.createBlog(blogData.validData)
        const postData = await createPostData();

        // Добавляем блог для проверки blogId
        const createResponseBlog = await blogsTestManager.createBlog(blogData.validData)
        const blogId = createResponseBlog.body.id

        const validData1 = {
            ...postData.validData,
            title: 'first post',
            blogId: blogId
        }
        const validData2 = {
            ...postData.validData,
            title: 'second post',
            blogId: blogId
        }

        // Добавляем посты
        await postsTestManager.createPost(postData.validData)
        const firstCreateResponse = await postsTestManager.createPost(validData1)
        const secondCreateResponse = await postsTestManager.createPost(validData2)
        const firstCreatedPost = firstCreateResponse.body
        const secondCreatedPost = secondCreateResponse.body

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [secondCreatedPost, firstCreatedPost]
            })
    })

    it('shouldn`t return posts for incorrect blogId', async () => {
            await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/-1/posts`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should create post for correct blogId', async () => {
        // Добавляем блог для проверки blogId
        const createResponseBlog = await blogsTestManager.createBlog(blogData.validData)
        const blogId = createResponseBlog.body.id
        const blog = await blogRepository.getBlogById(blogId)

        const postData = await createPostData();
        const validData = {
            ...postData.validData,
            title: 'created post',
            blogId: blogId
        }

        const response = await request (app)
            .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .set(authData)
            .send(validData)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdPost = response.body;
        expect(createdPost).toEqual({
            id: createdPost.id,
            title: validData.title,
            shortDescription: validData.shortDescription,
            content: validData.content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: createdPost.createdAt,
        })
    })

    it('unauthorized user shouldn`t create blog', async () => {
        // Проверка на отсутствие авторизации
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .send(blogData.validData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn`t create blog with incorrect name data', async () => {
        // Проверка на отсутствие названия
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(blogData.dataWithOutName)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a name.',
                        field: 'name'
                    }
                ]
            })

        // Название превышает 15 символов
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(blogData.dataWithBigName)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Name should contain 3-15 characters.',
                        field: 'name'
                    }
                ]
            })
    })

    it('shouldn`t create blog with incorrect description data', async () => {
        // Проверка на отсутствие описания
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(blogData.dataWithoutDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a description.',
                        field: 'description'
                    }
                ]
            })

        // Описание превышает 500 символов
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(blogData.dataWithBigDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Description should contain 3-500 characters.',
                        field: 'description'
                    }
                ]
            })
    })

    it('shouldn`t create blog with incorrect websiteUrl data', async () => {
        // Website url отсутствует
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(blogData.dataWithoutUrl)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a Website URL.',
                        field: 'websiteUrl'
                    }
                ]
            })

        // website url превышает 100 символов
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(blogData.dataWithBigUrl)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Website URL should not exceed 100 characters.',
                        field: 'websiteUrl'
                    }
                ]
            })

        // Некорректный формат website url
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(blogData.dataWithInvalidUrl)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a valid Website URL.',
                        field: 'websiteUrl'
                    }
                ]
            })
    })

    it('should create blog with correct input data', async () => {
        await blogsTestManager.createBlog(blogData.validData)
    })

    it ('should return blog by id', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlog)
    })

    it('should return 404 cuz id incorrect', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/-1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('unauthorized user shouldn`t update blog', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        // Отправляем запрос на обновление от неавторизованного пользователя
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .send(blogData.validDataForUpdate)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn`t update blog with incorrect name data', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        // Проверка на отсутствие названия
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.dataWithOutName)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a name.',
                        field: 'name'
                    }
                ]
            })

        // Название превышает 15 символов
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.dataWithOutName)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a name.',
                        field: 'name'
                    }
                ]
            })
    })

    it('shouldn`t update blog with incorrect description data', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        // Проверка на отсутствие описания
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.dataWithoutDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a description.',
                        field: 'description'
                    }
                ]
            })

        // Описание превышает 500 символов
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.dataWithBigDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Description should contain 3-500 characters.',
                        field: 'description'
                    }
                ]
            })
    })

    it('shouldn`t update blog with incorrect websiteUrl data', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        // Проверка на отсутствие WebsiteUrl
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.dataWithoutUrl)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a Website URL.',
                        field: 'websiteUrl'
                    }
                ]
            })

        // WebsiteUrl превышает 100 символов
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.dataWithBigUrl)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Website URL should not exceed 100 characters.',
                        field: 'websiteUrl'
                    }
                ]
            })

        // WebsiteUrl некорректный формат
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.dataWithInvalidUrl)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a valid Website URL.',
                        field: 'websiteUrl'
                    }
                ]
            })
    })

    it('should update blog with correct data', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        // Обновляем блог
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .send(blogData.validDataForUpdate)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        // Вызываем обновленный блог
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdBlog,
                name: blogData.validDataForUpdate.name,
                description: blogData.validDataForUpdate.description,
                websiteUrl: blogData.validDataForUpdate.websiteUrl
            })
    })

    it('unauthorized user shouldn`t delete blog', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        // Отправляем запрос на удаление от неавторизованного пользователя
        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should delete blog by id', async () => {
        // Добавляем блог
        const createResponse = await blogsTestManager.createBlog(blogData.validData)
        const createdBlog = createResponse.body

        // Отправляем запрос на удаление от неавторизованного пользователя
        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set(authData)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('shouldn`t delete blog by id', async () => {
        // Отправляем запрос на удаление несуществующего блога
        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/-1`)
            .set(authData)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
})