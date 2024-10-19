import request from "supertest";
import {app} from "../src/app";
import {clearDB} from "../src/db/db";
import {HTTP_STATUSES} from "../src/http-statuses";
import {authData, postData, postsTestManager} from "./test-helpers";
import {SETTINGS} from "../src/settings";

describe('/posts', () => {
    // beforeAll(async () => {
    //     clearDB();
    // })

    it('unauthorized user shouldn`t create post', async () => {
        // Проверка на отсутствие авторизации
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .send(postData.validData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn`t create post with incorrect title data', async () => {
        // Проверка на отсутствие заголовка
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithOutTitle)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a title.',
                        field: 'title'
                    }
                ]
            })

        // Заголовок превышает 30 символов
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithBigTitle)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Title should contain 3-30 characters.',
                        field: 'title',
                    }
                ]
            })
    })

    it('shouldn`t create post with incorrect shortDescription data', async () => {
        // Проверка на отсутствие короткого описания
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithoutShortDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a short description.',
                        field: 'shortDescription'
                    }
                ]
            })

        // Короткое описание превышает 100 символов
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithBigShortDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Short description should contain 3-100 characters.',
                        field: 'shortDescription',
                    }
                ]
            })
    })

    it('shouldn`t create post with incorrect content data', async () => {
        // Проверка на отсутствие контента
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithoutContent)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a content.',
                        field: 'content'
                    }
                ]
            })

        // Контент превышает 1000 символов
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithBigContent)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Content should contain 3-1000 characters.',
                        field: 'content',
                    }
                ]
            })
    })

    it('shouldn`t create post with incorrect blogId data', async () => {
        // Проверка на отсутствие blogId
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithoutBlogId)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a blog ID.',
                        field: 'blogId'
                    }
                ]
            })

        // Проверка на несуществующий blogId
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(postData.dataWithInvalidBlogId)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Blog ID was not found.',
                        field: 'blogId'
                    }
                ]
            })
    })

    it('should create post with correct input data', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)
    })

    it('should return 404 cuz id incorrect', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/-1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('unauthorized user shouldn`t update post', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Отправляем запрос на обновление от неавторизованного пользователя
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .send(postData.validDataForUpdate)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn`t update post with incorrect title data', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Проверка на отсутствие заголовка
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithOutTitle)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a title.',
                        field: 'title'
                    }
                ]
            })

        // Заголовок превышает 30 символов
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithBigTitle)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Title should contain 3-30 characters.',
                        field: 'title'
                    }
                ]
            })
    })

    it('shouldn`t update post with incorrect shortDescription data', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Проверка на отсутствие короткого описания
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithoutShortDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a short description.',
                        field: 'shortDescription'
                    }
                ]
            })

        // Короткое описание превышает 100 символов
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithBigShortDescription)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Short description should contain 3-100 characters.',
                        field: 'shortDescription',
                    }
                ]
            })
    })

    it('shouldn`t update post with incorrect content data', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Проверка на отсутствие контента
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithoutContent)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a content.',
                        field: 'content'
                    }
                ]
            })

        // Контент превышает 1000 символов
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithBigContent)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Content should contain 3-1000 characters.',
                        field: 'content',
                    }
                ]
            })
    })

    it('shouldn`t create post with incorrect blogId data', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Проверка на отсутствие blogId
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithoutBlogId)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Please enter a blog ID.',
                        field: 'blogId'
                    }
                ]
            })

        // Проверка на несуществующий blogId
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.dataWithInvalidBlogId)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Blog ID was not found.',
                        field: 'blogId'
                    }
                ]
            })
    })

    it('should update post with correct data', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Обновляем пост
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set(authData)
            .send(postData.validDataForUpdate)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        // Вызываем обновленный пост
        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdPost,
                title: postData.validDataForUpdate.title,
                shortDescription: postData.validDataForUpdate.shortDescription,
                content: postData.validDataForUpdate.content,
                blogId: postData.validDataForUpdate.blogId
            })
    })

    it('unauthorized user shouldn`t delete post', async () => {
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Отправляем запрос на удаление от неавторизованного пользователя
        await request(app)
            .delete(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should return 204 and empty array', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.TESTING}/all-data`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200, [])
    })

})