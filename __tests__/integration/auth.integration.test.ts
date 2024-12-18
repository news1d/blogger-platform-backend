import {clearDB} from "../../src/db/mongoDb";
import {nodemailerService} from "../../src/application/nodemailer-service";
import {authService} from "../../src/modules/auth/auth-service";
import {DomainStatusCode} from "../../src/helpers/domain-status-code";
import {testSeeder} from "./test.seeder";
import mongoose from "mongoose";
import {SETTINGS} from "../../src/settings";
import {userService} from "../../src/modules/users/user-service";


describe('/auth-integration', () => {
    beforeAll(async () => {
        await mongoose.connect(SETTINGS.MONGO_URL + '/' + SETTINGS.DB_NAME);
        await clearDB();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe('userRegistration', () => {
        nodemailerService.sendEmail = jest
            .fn()
            .mockImplementation((email: string, code: string, template: (code: string) => string) =>
                Promise.resolve(true)
            );

        it('should register user with correct data', async () => {
            const { login, password, email } = testSeeder.createUserDto();

            const result = await authService.registration(login, password, email);

            expect(result.status).toBe(DomainStatusCode.Success);
            expect(nodemailerService.sendEmail).toBeCalled();
            expect(nodemailerService.sendEmail).toBeCalledTimes(1);
        });

        it('should not register user twice', async () => {
            const { login, password, email } = testSeeder.createUserDto();
            await testSeeder.insertUser({ login, password, email })

            const result = await authService.registration(login, password, email);

            expect(result.status).toBe(DomainStatusCode.BadRequest);
        });

        describe('confirmEmail', () => {

            it('should not confirm email if user does not exist', async () => {
                const result = await authService.registerConfirmation('somecode')

                expect(result.status).toBe(DomainStatusCode.BadRequest);
            });

            it('should not confirm email which is confirmed', async () => {
                const code = 'test1';

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({
                    login,
                    password,
                    email,
                    confirmationCode: code,
                    isConfirmed: 'confirmed'
                });

                const result = await authService.registerConfirmation(code)
                expect(result.status).toBe(DomainStatusCode.BadRequest);
            });

            it('should not confirm email with expired code', async () => {
                const code = 'test2';

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({
                    login,
                    password,
                    email,
                    confirmationCode: code,
                    expirationDate: new Date()
                });

                const result = await authService.registerConfirmation(code);
                expect(result.status).toBe(DomainStatusCode.BadRequest);
            });

            it('confirm user', async () => {
                const code = 'test3';

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({ login, password, email, confirmationCode: code});

                const result = await authService.registerConfirmation(code);

                expect(result.status).toBe(DomainStatusCode.Success);
            });

        })

        describe('password recovery', () => {

            it('should send recovery code', async () => {
                const { login, password, email } = testSeeder.createUserDto();

                const result = await authService.passwordRecovery(email);

                expect(result).toBe(true);
                expect(nodemailerService.sendEmail).toBeCalled();
                expect(nodemailerService.sendEmail).toBeCalledTimes(1);
            });

            it('should create new password', async () => {
                const code = 'test4';
                const newPassword = 'validPassword'

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({ login, password, email, recoveryCode: code});

                const result = await userService.newPassword(newPassword, code);

                expect(result.status).toBe(DomainStatusCode.Success);
            })

            it('should not recovery password with expired code', async () => {
                const code = 'test5';
                const newPassword = 'validPassword'

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({
                    login,
                    password,
                    email,
                    recoveryCode: code,
                    recoveryExpiration: new Date()
                });

                const result = await userService.newPassword(newPassword, code);
                expect(result.status).toBe(DomainStatusCode.BadRequest);
            });



        })

    })

})