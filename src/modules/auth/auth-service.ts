import {userRepository} from "../users/user-repository";
import bcrypt from "bcrypt";
import {UserDBType} from "../../types/user.types";
import {Result} from "../../types/result.types";
import {createResult} from "../../helpers/result-function";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {nodemailerService} from "../../application/nodemailer-service";
import {emailExamples} from "../../helpers/email-examples";
import {MeViewModel} from "../../types/auth.types";


export const authService = {
    async getMyInfo(userId: string): Promise<MeViewModel | null> {
        const user = await userRepository.getUserById(userId);
        return {
            email: user!.email,
            login: user!.login,
            userId: user!._id.toString(),
        };
    },
    async registration(login: string, email: string, password: string): Promise<Result<string | null>> {
        const result = await this.checkUnique(login, email);

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt);

        const user: UserDBType = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID().toString(),
                expirationDate: add(new Date(), { minutes: 5 }),
                isConfirmed: 'unconfirmed',
            },
        };

        await userRepository.createUser(user);

        nodemailerService.sendEmail(user.email, user.emailConfirmation.confirmationCode!, emailExamples.registrationEmail)
            .catch(er => console.error('Error in send email:', er));

        return createResult(DomainStatusCode.Success);
    },
    async registerConfirmation(code: string): Promise<Result<string | null>> {
        const user = await userRepository.findUserByConfirmationCode(code)

        if (!user || user.emailConfirmation.confirmationCode !== code) {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'Verification code incorrect.', field: 'code' }])
        }

        if (user.emailConfirmation.isConfirmed === 'confirmed') {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'The account has already been confirmed.', field: 'code' }])
        }

        if (user.emailConfirmation.expirationDate! < new Date()) {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'Verification code expired.', field: 'code' }])
        }

        await userRepository.updateConfirmation(user._id.toString())
        return createResult(DomainStatusCode.Success)
    },
    async registerEmailResending(email: string) {
        const user = await userRepository.getUserByEmail(email);

        if (user!.emailConfirmation.isConfirmed === 'confirmed') {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'Email is already confirmed.', field: 'email' }])
        }

        const newCode = randomUUID().toString()
        const newExpirationDate = add(new Date(), { minutes: 5 })

        await userRepository.updateConfirmationCode(user!._id.toString(), newCode, newExpirationDate)
        const updatedUser = await userRepository.getUserById(user!._id.toString())

        nodemailerService.sendEmail(updatedUser!.email, updatedUser!.emailConfirmation.confirmationCode!, emailExamples.registrationEmail)
            .catch(er => console.error('Error in send email:', er));

        return createResult(DomainStatusCode.Success);
    },
    async checkUnique(login: string, email: string): Promise<Result<string | null>> {
        const isLoginExists = await userRepository.getUserByLogin(login)
        const isEmailExists = await userRepository.getUserByEmail(email)

        if (isLoginExists) {
            return createResult(DomainStatusCode.BadRequest, null, [{message: 'This login has already been used.', field: 'login'}])
        }

        if (isEmailExists) {
            return createResult(DomainStatusCode.BadRequest, null, [{message: 'This email address has already been used.', field: 'email'}])
        }

        return createResult(DomainStatusCode.Success)
    },
    async _generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}