import {clearDB} from "../../src/db/mongoDb";
import {nodemailerService} from "../../src/application/nodemailer-service";
import {authService} from "../../src/modules/auth/auth-service";
import {DomainStatusCode} from "../../src/helpers/domain-status-code";
import {testSeeder} from "./test.seeder";


describe('/auth-integration', () => {
    beforeEach(async () => {
        await clearDB();
    })

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
                const code = 'test';

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({
                    login,
                    password,
                    email,
                    code,
                    isConfirmed: 'confirmed'
                });

                const result = await authService.registerConfirmation(code)
                expect(result.status).toBe(DomainStatusCode.BadRequest);
            });

            it('should not confirm email with expired code', async () => {
                const code = 'test';

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({
                    login,
                    password,
                    email,
                    code,
                    expirationDate: new Date()
                });

                const result = await authService.registerConfirmation(code);
                expect(result.status).toBe(DomainStatusCode.BadRequest);
            });

            it('confirm user', async () => {
                const code = 'validCode';

                const { login, password, email } = testSeeder.createUserDto();
                await testSeeder.insertUser({ login, password, email, code });

                const result = await authService.registerConfirmation(code);

                expect(result.status).toBe(DomainStatusCode.Success);
            });

        })

    })

})