import {clearDB} from "../src/db/mongoDb";
import {app} from "../src/app";
import request from "supertest";
import {SETTINGS} from "../src/settings";
import {HTTP_STATUSES} from "../src/helpers/http-statuses";
import {bearerAuth, usersTestManager} from "./test-helpers";


describe('/auth', () => {
    beforeAll(async () => {
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
        // Добавляем пользователей
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

})