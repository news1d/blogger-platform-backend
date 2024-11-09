import request from 'supertest';
import {SETTINGS} from '../src/settings'
import {app} from "../src/app";
import {clearDB} from "../src/db/mongoDb";
import {authData, usersTestManager} from "./test-helpers";
import {HTTP_STATUSES} from "../src/helpers/http-statuses";


describe('/users', () => {
    beforeAll(async () => {
        await clearDB()
    })

    it('should return a paginated list of users sorted by name', async () => {
        // Добавляем пользователей
        const firstUser = {
            login: 'Dimych',
            password: 'password1',
            email: 'dimych@gmail.com',
        }
        const secondUser = {
            login: 'Natalia',
            password: 'password2',
            email: 'kuzyuberdina@gmail.com',
        }
        const thirdUser = {
            login: 'login1',
            password: 'password1',
            email: 'email1@email.com',
        }
        const fourthUser = {
            login: 'login2',
            password: 'password2',
            email: 'email2@email.com',
        }


        await usersTestManager.createUser(thirdUser)
        await usersTestManager.createUser(fourthUser)
        const firstCreateResponse = await usersTestManager.createUser(firstUser)
        const secondCreateResponse = await usersTestManager.createUser(secondUser)
        const firstCreatedUser = firstCreateResponse.body
        const secondCreatedUser = secondCreateResponse.body

        await request(app)
            .get(SETTINGS.PATH.USERS)
            .set(authData)
            .query({
                sortBy: 'login',
                pageSize: 5,
                pageNumber: 1,
                sortDirection: 'asc',
                searchLoginTerm: 'D',
                searchEmailTerm: 'K'
            })
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 5,
                totalCount: 2,
                items: [firstCreatedUser, secondCreatedUser]
            })
    })

    it('unauthorized user shouldn`t get/create/delete blog', async () => {
        await request(app)
            .get(SETTINGS.PATH.USERS)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .post(SETTINGS.PATH.USERS)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .delete(`${SETTINGS.PATH.USERS}/1`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn`t create user with non-unique login', async () => {
        const firstUser = {
            login: 'Dimych1',
            password: 'password1',
            email: 'artur@gmail.com',
        }
        const secondUser = {
            login: 'Dimych1',
            password: 'password2',
            email: 'bezgoev@gmail.com',
        }

        await usersTestManager.createUser(firstUser)
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(authData)
            .send(secondUser)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                "errorsMessages": [
                    {
                        "message": "This login has already been used.",
                        "field": "login"
                    }
                ]
            })
    })

    it('shouldn`t create user with non-unique email', async () => {
        const firstUser = {
            login: 'Artur',
            password: 'password1',
            email: 'arturbezgoev@gmail.com',
        }
        const secondUser = {
            login: 'Bezgoev',
            password: 'password2',
            email: 'arturbezgoev@gmail.com',
        }

        await usersTestManager.createUser(firstUser)
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set(authData)
            .send(secondUser)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                "errorsMessages": [
                    {
                        "message": "This email address has already been used.",
                        "field": "email"
                    }
                ]
            })
    })

    it('should return 204 and delete user', async () => {
        const user = {
            login: 'asol',
            password: 'password1',
            email: 'bezgoevartur@gmail.com',
        }

        const response = await usersTestManager.createUser(user)
        const createdUser = response.body

        await request(app)
            .delete(`${SETTINGS.PATH.USERS}/${createdUser.id}`)
            .set(authData)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it('should create user with correct data', async () => {
        const user = {
            login: 'user01',
            password: 'qwerty1',
            email: 'email1p@gg.cm',
        }

        await usersTestManager.createUser(user)
    })
})