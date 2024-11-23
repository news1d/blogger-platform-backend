import request from "supertest";
import {app} from "../../src/app";
import {clearDB} from "../../src/db/mongoDb";
import {HTTP_STATUSES} from "../../src/helpers/http-statuses";
import {authData, bearerAuth, createPostData, postsTestManager, usersTestManager} from "../test-helpers";
import {SETTINGS} from "../../src/settings";


describe('/posts', () => {
    beforeAll(async () => {
       await clearDB();
    })

    it('unauthorized user shouldn`t create post', async () => {
        const postData = await createPostData();
        // Проверка на отсутствие авторизации
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .send(postData.validData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn`t create post with incorrect title data', async () => {
        const postData = await createPostData();
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
        const postData = await createPostData();
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
        const postData = await createPostData();
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
        const postData = await createPostData();
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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
            .expect(res => {
                expect(res.body.errorsMessages).toEqual([
                    {
                        message: expect.any(String),
                        field: 'blogId'
                    }
                ]);
            });
    })

    it('should create post with correct input data', async () => {
        const postData = await createPostData();
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
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Invalid ID format.',
                        field: 'id'
                    }
                ]
            })
    })

    it('unauthorized user shouldn`t update post', async () => {
        const postData = await createPostData();
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
        const postData = await createPostData();
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
        const postData = await createPostData();
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
        const postData = await createPostData();
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

    it('shouldn`t update post with incorrect blogId data', async () => {
        const postData = await createPostData();
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
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
            .expect(res => {
                expect(res.body.errorsMessages).toEqual([
                    {
                        message: expect.any(String),
                        field: 'blogId'
                    }
                ])
            });
    })

    it('should update post with correct data', async () => {
        const postData = await createPostData();
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
        const postData = await createPostData();
        // Добавляем пост
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        // Отправляем запрос на удаление от неавторизованного пользователя
        await request(app)
            .delete(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should create comment for post by accessToken', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'Damir',
            password: 'password1',
            email: 'doma@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'doma@gmail.com',
            password: 'password1',
        }

        const responseWithAccessToken =  await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authData)
            .expect(HTTP_STATUSES.OK_200)

        const accessToken = responseWithAccessToken.body.accessToken

        // Добавляем пост
        const postData = await createPostData();
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)

        // Добавляем комментарий к посту
        const comment = {
            content: 'any comments any comments any comments'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body
        expect(createdComment).toEqual({
            id: expect.any(String),
            content: comment.content,
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: userData.login,
            },
            createdAt: expect.any(String)
        })
    })

    it('should return all comments for post', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'Doma',
            password: 'password1',
            email: 'Roma229@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'Doma',
            password: 'password1',
        }

        const responseWithAccessToken =  await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authData)
            .expect(HTTP_STATUSES.OK_200)

        const accessToken = responseWithAccessToken.body.accessToken

        // Добавляем пост
        const postData = await createPostData();
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)

        // Добавляем комментарии к посту
        const firstComment = {
            content: 'first comment first comment first comment'
        }

        const secondComment = {
            content: 'second comment second comment second comment'
        }

        const firstCreatedResponse = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(firstComment)
            .expect(HTTP_STATUSES.CREATED_201)

        const secondCreatedResponse = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(secondComment)
            .expect(HTTP_STATUSES.CREATED_201)

        const firstCreatedBlog = firstCreatedResponse.body
        const secondCreatedBlog = secondCreatedResponse.body

        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .query({
                pageSize: 5,
                pageNumber: 1,
                sortDirection: 'asc',
                sortBy: 'content',
            })
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 5,
                totalCount: 2,
                items: [firstCreatedBlog, secondCreatedBlog]
            })
    })

    it('should return 204 and empty array', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.TESTING}/all-data`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })


})