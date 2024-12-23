import {UserRepository} from "../users/user-repository";
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
import {UserService} from "../users/user-service";


export class AuthService {
    constructor(protected userRepository: UserRepository, protected userService: UserService) {}

    async getMyInfo(userId: string): Promise<MeViewModel | null> {
        const user = await this.userRepository.getUserById(userId);
        return {
            email: user!.email,
            login: user!.login,
            userId: user!._id.toString(),
        };
    }

    async passwordRecovery(email: string): Promise<boolean> {
        const user = await this.userRepository.getUserByEmail(email);

        if (!user) {
            return true;
        }

        const newCode = randomUUID().toString()
        const newExpirationDate = add(new Date(), { minutes: 5 })

        await this.userRepository.updateRecoveryCode(user._id.toString(), newCode, newExpirationDate)
        const updatedUser = await this.userRepository.getUserById(user._id.toString())

        nodemailerService.sendEmail(updatedUser!.email, updatedUser!.passwordRecovery.recoveryCode!, emailExamples.passwordRecovery)
            .catch(er => console.error('Error in send email:', er));

        return true;
    }

    async registration(login: string, email: string, password: string): Promise<Result<string | null>> {
        const result = await this.userService.checkUnique(login, email);

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
            passwordRecovery: {
                recoveryCode: null,
                expirationDate: null
            }
        };

        await this.userRepository.createUser(user);

        nodemailerService.sendEmail(user.email, user.emailConfirmation.confirmationCode!, emailExamples.registrationEmail)
            .catch(er => console.error('Error in send email:', er));

        return createResult(DomainStatusCode.Success);
    }

    async registerConfirmation(code: string): Promise<Result<string | null>> {
        const user = await this.userRepository.findUserByConfirmationCode(code)

        if (!user || user.emailConfirmation.confirmationCode !== code) {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'Verification code incorrect.', field: 'code' }])
        }

        if (user.emailConfirmation.isConfirmed === 'confirmed') {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'The account has already been confirmed.', field: 'code' }])
        }

        if (user.emailConfirmation.expirationDate! < new Date()) {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'Verification code expired.', field: 'code' }])
        }

        await this.userRepository.updateConfirmation(user._id.toString())
        return createResult(DomainStatusCode.Success)
    }

    async registerEmailResending(email: string) {
        const user = await this.userRepository.getUserByEmail(email);

        if (!user) {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'The user does not exist.', field: 'email' }])
        }

        if (user.emailConfirmation.isConfirmed === 'confirmed') {
            return createResult(DomainStatusCode.BadRequest, null, [{ message: 'Email is already confirmed.', field: 'email' }])
        }

        const newCode = randomUUID().toString()
        const newExpirationDate = add(new Date(), { minutes: 5 })

        await this.userRepository.updateConfirmationCode(user._id.toString(), newCode, newExpirationDate)
        const updatedUser = await this.userRepository.getUserById(user._id.toString())

        nodemailerService.sendEmail(updatedUser!.email, updatedUser!.emailConfirmation.confirmationCode!, emailExamples.registrationEmail)
            .catch(er => console.error('Error in send email:', er));

        return createResult(DomainStatusCode.Success);
    }

    async _generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}