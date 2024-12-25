import {clearDB} from "../../src/db/mongoDb";
import request from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/helpers/http-statuses";
import {bearerAuth, createPostData, postsTestManager, usersTestManager} from "../test-helpers";
import mongoose from "mongoose";
import {LikeStatus} from "../../src/types/like.types";


describe('comments', () => {
    beforeAll(async () => {
        await mongoose.connect(SETTINGS.MONGO_URL + '/' + SETTINGS.DB_NAME);
        await clearDB();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });


    it('should return comment by id', async () => {
        // Добавляем пользователей
        const userData = {
            login: 'igor',
            password: 'password1',
            email: 'izychaet@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'izychaet@gmail.com',
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

        // Ищем нужный комментарий по id
        await request(app)
            .get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .expect(HTTP_STATUSES.OK_200, createdComment)
    })

    it('should delete comment by id', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'papabell',
            password: 'password1',
            email: 'papabell@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'papabell',
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
            content: 'sold sold sold sold sold'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body

        // Удаляем комментарий по id
        await request(app)
            .delete(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set(bearerAuth(accessToken))
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        // Проверяем, что комментарий с таким id больше не существует
        await request(app)
            .get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('shouldn`t delete a comment that is owned by another user', async () => {
        // Добавляем пользователей
        const firstUserData = {
            login: 'pashgun',
            password: 'password1',
            email: 'pashgun@gmail.com',
        }

        const secondUserData = {
            login: 'easygogame',
            password: 'password1',
            email: 'easygogame@gmail.com',
        }

        await usersTestManager.createUser(firstUserData)
        await usersTestManager.createUser(secondUserData)


        const firstUserAuthData = {
            loginOrEmail: 'pashgun',
            password: 'password1',
        }

        const secondUserAuthData = {
            loginOrEmail: 'easygogame@gmail.com',
            password: 'password1',
        }

        const responseWithAccessTokenForFisrtUser =  await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(firstUserAuthData)
            .expect(HTTP_STATUSES.OK_200)

        const responseWithAccessTokenForSecondUser =  await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(secondUserAuthData)
            .expect(HTTP_STATUSES.OK_200)

        const firstUserAccessToken = responseWithAccessTokenForFisrtUser.body.accessToken
        const secondUserAccessToken = responseWithAccessTokenForSecondUser.body.accessToken

        // Добавляем пост
        const postData = await createPostData();
        const createResponse = await postsTestManager.createPost(postData.validData)
        const createdPost = createResponse.body

        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(HTTP_STATUSES.OK_200, createdPost)

        // Добавляем комментарий к посту
        const comment = {
            content: 'something something something something'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(firstUserAccessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body

        // Удаляем чужой комментарий по id
        await request(app)
            .delete(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set(bearerAuth(secondUserAccessToken))
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })

    it('should update comment by id', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'swagger',
            password: 'password1',
            email: 'swagger@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'swagger',
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
            content: 'buy buy buy buy buy buy'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body

        await request(app)
            .get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .expect(HTTP_STATUSES.OK_200, createdComment)

        const dataForUpdate = {
            content: 'not today not today not today not today'
        }

        // Обновляем комментарий по id
        await request(app)
            .put(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set(bearerAuth(accessToken))
            .send(dataForUpdate)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdComment,
                content: 'not today not today not today not today'
            })
    })

    it('shouldn`t update comment with incorrect data', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'maverick',
            password: 'password1',
            email: 'maverick@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'maverick@gmail.com',
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
            content: 'buy buy buy buy buy buy'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body

        await request(app)
            .get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .expect(HTTP_STATUSES.OK_200, createdComment)

        const dataForUpdate = {
            content: 'short'
        }

        // Обновляем комментарий по id
        await request(app)
            .put(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set(bearerAuth(accessToken))
            .send(dataForUpdate)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'Content should contain 20-300 characters.',
                        field: 'content'
                    }
                ]
            })
    })

    it('should have like status None', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'chikkgeek',
            password: 'password1',
            email: 'chikkgeek@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'chikkgeek',
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
            content: 'going brrrr going brrrr'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body

        expect(createdComment.likesInfo.likesCount).toEqual(0)
        expect(createdComment.likesInfo.dislikesCount).toEqual(0)
        expect(createdComment.likesInfo.myStatus).toEqual(LikeStatus.None)
    })

    it('should change the number of likes and likeStatus', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'gingerboy',
            password: 'password1',
            email: 'gingerboy@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'gingerboy',
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
            content: 'ginger cookies ginger cookies'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body

        // Ставим лайк
        await request(app)
            .put(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}/like-status`)
            .set(bearerAuth(accessToken))
            .send({likeStatus: LikeStatus.Like})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        // Получаем данные о комментарии
        const commentDataResponse = await request(app)
            .get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set(bearerAuth(accessToken))
            .expect(HTTP_STATUSES.OK_200)

        const commentData = commentDataResponse.body

        expect(commentData.likesInfo.likesCount).toEqual(1)
        expect(commentData.likesInfo.dislikesCount).toEqual(0)
        expect(commentData.likesInfo.myStatus).toEqual(LikeStatus.Like)
    })

    it('shouldn`t update like status with incorrect data ', async () => {
        // Добавляем пользователя
        const userData = {
            login: 'incubator',
            password: 'password1',
            email: 'incubator@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'incubator',
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
            content: 'test test test test test'
        }

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set(bearerAuth(accessToken))
            .send(comment)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdComment = response.body

        // Пытаемся установить недопустимый статус
        const errorResponse = await request(app)
            .put(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}/like-status`)
            .set(bearerAuth(accessToken))
            .send({likeStatus: 'SuperLike'})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorResponse.body.errorsMessages[0].field).toBe('likeStatus');
        expect(errorResponse.body.errorsMessages[0].message).toEqual(expect.any(String));
    })
})