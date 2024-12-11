import request from "supertest";
import {app} from "../../src/app";
import {clearDB} from "../../src/db/mongoDb";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/helpers/http-statuses";
import {extractRefreshToken, usersTestManager} from "../test-helpers";
import {v4 as uuidv4} from "uuid";
import {SessionViewModel} from "../../src/types/sessions.types";

describe('/sessions', () => {
    beforeEach(async () => {
        await clearDB();
    })

    it('shouldn`t terminate session of a non-existent device', async () => {
        const userData = {
            login: 'user1',
            password: 'password1',
            email: 'user1@gmail.com',
        };

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'user1',
            password: 'password1',
        };

        const response = await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authData)
            .expect(HTTP_STATUSES.OK_200)

        const refreshToken = extractRefreshToken(response.headers['set-cookie']);

        const randomDeviceId = uuidv4();

        await request(app)
            .delete(`${SETTINGS.PATH.SESSIONS}/devices/${randomDeviceId}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('shouldn`t terminate device session of other user', async () => {
        // Добавляем пользователей
        const userData1 = {
            login: 'user1',
            password: 'password1',
            email: 'user1@gmail.com',
        };

        const userData2 = {
            login: 'user2',
            password: 'password2',
            email: 'user2@gmail.com',
        };

        await usersTestManager.createUser(userData1);
        await usersTestManager.createUser(userData2);

        const authData = [
            {
                loginOrEmail: 'user1',
                password: 'password1',
            },
            {
                loginOrEmail: 'user2',
                password: 'password2',
            }
        ];

        const responses = [];

        // Логиним пользователей
        for (let i = 0; i < 2; i++) {
            const response = await request(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send(authData[i])
                .expect(HTTP_STATUSES.OK_200);
            responses.push(response);
        }

        const refreshToken1 = extractRefreshToken(responses[0].headers['set-cookie']);
        const refreshToken2 = extractRefreshToken(responses[1].headers['set-cookie']);

        // Получаем сессии второго пользователя
        const secondUserSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken2}`)
            .expect(HTTP_STATUSES.OK_200);

        const secondUserDeviceId = secondUserSessionsResponse.body[0].deviceId;

        // Пытаемся завершить сессию второго пользователя, используя refreshToken первого пользователя
        await request(app)
            .delete(`${SETTINGS.PATH.SESSIONS}/devices/${secondUserDeviceId}`)
            .set('Cookie', `refreshToken=${refreshToken1}`)
            .expect(HTTP_STATUSES.FORBIDDEN_403)
    })

    it('should update LastActiveDate of session', async () => {
        const userData = {
            login: 'user1',
            password: 'password1',
            email: 'user1@gmail.com',
        };

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'user1',
            password: 'password1',
        };

        const loginResponses = [];

        for (let i = 0; i < 4; i++) {
            const response = await request(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send(authData)
                .set('User-Agent', `TestAgent${i}`)
                .expect(HTTP_STATUSES.OK_200);

            loginResponses.push(response);
        }

        const refreshToken = extractRefreshToken(loginResponses[0].headers['set-cookie']);

        // Получаем информацию об активных сессиях пользователя
        const userSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Должно быть 4 сессии
        expect(userSessionsResponse.body).toHaveLength(4);

        // Обновляем refreshToken пользователя для первой сессии
        const refreshTokenResponse = await request(app)
            .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        const newRefreshToken = extractRefreshToken(refreshTokenResponse.headers['set-cookie']);

        // Получаем обновлённую информацию об активных сессиях пользователя
        const updatedUserSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${newRefreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Кол-во сессий должно остаться прежним
        expect(updatedUserSessionsResponse.body).toHaveLength(4);

        // LastActiveDate должен измениться только у первой сессии
        expect(userSessionsResponse.body[0].lastActiveDate).not.toBe(updatedUserSessionsResponse.body[0].lastActiveDate);
        expect(userSessionsResponse.body[1].lastActiveDate).toBe(updatedUserSessionsResponse.body[1].lastActiveDate);
        expect(userSessionsResponse.body[2].lastActiveDate).toBe(updatedUserSessionsResponse.body[2].lastActiveDate);
        expect(userSessionsResponse.body[3].lastActiveDate).toBe(updatedUserSessionsResponse.body[3].lastActiveDate);
    })

    it('should terminate session', async () => {
        const userData = {
            login: 'user1',
            password: 'password1',
            email: 'user1@gmail.com',
        };

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'user1',
            password: 'password1',
        };

        const loginResponses = [];

        for (let i = 0; i < 4; i++) {
            const response = await request(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send(authData)
                .set('User-Agent', `TestAgent${i}`)
                .expect(HTTP_STATUSES.OK_200);

            loginResponses.push(response);
        }

        const refreshToken = extractRefreshToken(loginResponses[0].headers['set-cookie']);

        // Получаем информацию об активных сессиях пользователя
        const userSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Должно быть 4 сессии
        const sessions = userSessionsResponse.body;
        expect(sessions).toHaveLength(4);

        // Завершаем вторую сессию, используя refreshToken первой сессии
        const deletedSessionDeviceId = sessions[1].deviceId;
        await request(app)
            .delete(`${SETTINGS.PATH.SESSIONS}/devices/${deletedSessionDeviceId}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        // Получаем обновлённую информацию об активных сессиях пользователя
        const updatedUserSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Кол-во сессий должно измениться
        const remainingSessions = updatedUserSessionsResponse.body;
        expect(remainingSessions).toHaveLength(3);

        // Проверяем, что удаленной сессии больше нет
        const isDeletedSessionPresent = remainingSessions.some(
            (session: SessionViewModel) => session.deviceId === deletedSessionDeviceId
        );

        // Ожидаем, что удаленной сессии нет среди оставшихся
        expect(isDeletedSessionPresent).toBe(false);
    })

    it('should logout and terminate session', async () => {
        const userData = {
            login: 'user1',
            password: 'password1',
            email: 'user1@gmail.com',
        };

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'user1',
            password: 'password1',
        };

        const loginResponses = [];

        for (let i = 0; i < 4; i++) {
            const response = await request(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send(authData)
                .set('User-Agent', `TestAgent${i}`)
                .expect(HTTP_STATUSES.OK_200);

            loginResponses.push(response);
        }

        const refreshToken = extractRefreshToken(loginResponses[0].headers['set-cookie']);

        // Получаем информацию об активных сессиях пользователя
        const userSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Должно быть 4 сессии
        const sessions = userSessionsResponse.body;
        expect(sessions).toHaveLength(4);

        const secondSessionRefreshToken = extractRefreshToken(loginResponses[1].headers['set-cookie']);

        // Выходим из второй сессии
        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/logout`)
            .set('Cookie', `refreshToken=${secondSessionRefreshToken}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        // Получаем обновлённую информацию об активных сессиях пользователя
        const updatedUserSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Кол-во сессий должно измениться
        const remainingSessions = updatedUserSessionsResponse.body;
        expect(remainingSessions).toHaveLength(3);

        // Проверяем, что завершенной сессии больше нет
        const isTerminatedSessionPresent = remainingSessions.some(
            (session: SessionViewModel) => session.deviceId === sessions[1].deviceId
        );

        // Ожидаем, что завершенной сессии нет среди оставшихся
        expect(isTerminatedSessionPresent).toBe(false);
    })

    it('should terminate other sessions', async () => {
        const userData = {
            login: 'user1',
            password: 'password1',
            email: 'user1@gmail.com',
        };

        await usersTestManager.createUser(userData)

        const authData = {
            loginOrEmail: 'user1',
            password: 'password1',
        };

        const loginResponses = [];

        for (let i = 0; i < 4; i++) {
            const response = await request(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send(authData)
                .set('User-Agent', `TestAgent${i}`)
                .expect(HTTP_STATUSES.OK_200);

            loginResponses.push(response);
        }

        const refreshToken = extractRefreshToken(loginResponses[0].headers['set-cookie']);

        // Получаем информацию об активных сессиях пользователя
        const userSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Должно быть 4 сессии
        const sessions = userSessionsResponse.body;
        expect(sessions).toHaveLength(4);

        // Завершаем все сессии, кроме первой
        await request(app)
            .delete(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        // Получаем обновлённую информацию об активных сессиях пользователя
        const updatedUserSessionsResponse = await request(app)
            .get(`${SETTINGS.PATH.SESSIONS}/devices`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HTTP_STATUSES.OK_200);

        // Кол-во сессий должно измениться
        const remainingSessions = updatedUserSessionsResponse.body;
        expect(remainingSessions).toHaveLength(1);
        expect(sessions[0].deviceId).toBe(remainingSessions[0].deviceId);
    })
})
