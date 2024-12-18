import {clearDB} from "../../src/db/mongoDb";
import {app} from "../../src/app";
import request from "supertest";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/helpers/http-statuses";
import {bearerAuth, extractRefreshToken, usersTestManager} from "../test-helpers";
import mongoose from "mongoose";


describe('/auth', () => {
    beforeAll(async () => {
        await mongoose.connect(SETTINGS.MONGO_URL + '/' + SETTINGS.DB_NAME);
        await clearDB();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });


    beforeEach(async () => {
        await clearDB();
    })

    it('shouldn`t authenticate with incorrect data', async () => {
        const randomAuthData = {
            loginOrEmail: 'Bezgoev',
            password: 'qwerty',
        }

        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(randomAuthData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn`t authenticate with incorrect password', async () => {
        // Добавляем пользователей
        const userData = {
            login: 'Dimych',
            password: 'password1',
            email: 'dimych@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authDataWithIncorrectPass = {
            loginOrEmail: 'Dimych',
            password: 'qwerty',
        }

        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authDataWithIncorrectPass)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should authenticate with correct data', async () => {
        // Добавляем пользователей
        const userData = {
            login: 'Artur',
            password: 'password1',
            email: 'bezgoev@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authDataWithLogin = {
            loginOrEmail: 'Artur',
            password: 'password1',
        }

        const authDataWithEmail = {
            loginOrEmail: 'bezgoev@gmail.com',
            password: 'password1',
        }

        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authDataWithLogin)
            .expect(HTTP_STATUSES.OK_200)

        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authDataWithEmail)
            .expect(HTTP_STATUSES.OK_200)
    })

    it('should get information about user by accessToken', async () => {
        const userData = {
            login: 'Zamir',
            password: 'password1',
            email: 'dlyagoev@gmail.com',
        }

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'dlyagoev@gmail.com',
            password: 'password1',
        }

       const responseWithAccessToken =  await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authData)
            .expect(HTTP_STATUSES.OK_200)

        const accessToken = responseWithAccessToken.body.accessToken

        const responseWithUserInfo =  await request(app)
            .get(`${SETTINGS.PATH.AUTH}/me`)
            .set(bearerAuth(accessToken))
            .expect(HTTP_STATUSES.OK_200)

        const userInfo = responseWithUserInfo.body
        expect(userInfo).toEqual({
            email: 'dlyagoev@gmail.com',
            login: 'Zamir',
            userId: expect.any(String)
        })
    })

    it('should get new accessToken and refreshToken', async () => {
        const userData = {
            login: 'Madrid',
            password: 'password1',
            email: 'madrid@gmail.com',
        };

        await usersTestManager.createUser(userData);

        const authDataWithLogin = {
            loginOrEmail: 'Madrid',
            password: 'password1',
        };

        const response = await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authDataWithLogin)
            .expect(HTTP_STATUSES.OK_200);

        const refreshToken = extractRefreshToken(response.headers['set-cookie']);
        const accessToken = response.body.accessToken;

        const newResponse = await request(app)
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        const newRefreshToken = extractRefreshToken(newResponse.headers['set-cookie']);
        const newAccessToken = newResponse.body.accessToken;

        // Проверяем, что токены обновились
        expect(refreshToken).not.toBe(newRefreshToken);
        expect(accessToken).not.toBe(newAccessToken);
    });

    it('shouldn`t get new accessToken and refreshToken', async () => {
        const userData = {
            login: 'sitcom',
            password: 'password1',
            email: 'sitcom@gmail.com',
        };

        await usersTestManager.createUser(userData);

        const authDataWithLogin = {
            loginOrEmail: 'sitcom',
            password: 'password1',
        };

        const response = await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authDataWithLogin)
            .expect(HTTP_STATUSES.OK_200);

        const refreshToken = extractRefreshToken(response.headers['set-cookie']);
        const accessToken = response.body.accessToken;

        const newResponse = await request(app)
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        const newRefreshToken = extractRefreshToken(newResponse.headers['set-cookie']);
        const newAccessToken = newResponse.body.accessToken;

        // Проверяем, что токены обновились
        expect(refreshToken).not.toBe(newRefreshToken);
        expect(accessToken).not.toBe(newAccessToken);

        // Пытаемся обновить пару токенов, используя старый refreshToken
        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401);
    });


    it('shouldn`t get new accessToken and refreshToken after logout', async () => {
        const userData = {
            login: 'mustard',
            password: 'password1',
            email: 'mustard@gmail.com',
        };

        await usersTestManager.createUser(userData);

        const authDataWithLogin = {
            loginOrEmail: 'mustard',
            password: 'password1',
        };

        const response = await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authDataWithLogin)
            .expect(HTTP_STATUSES.OK_200);

        const refreshToken = extractRefreshToken(response.headers['set-cookie']);

        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/logout`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        // Пытаемся обновить пару токенов, используя старый refreshToken
        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401);
    });
})