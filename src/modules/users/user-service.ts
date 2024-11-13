import bcrypt from 'bcrypt'
import {UserDBType, UserInputModel} from "../../types/user.types";
import {userRepository} from "./user-repository";
import {OutputErrorsType} from "../../types/output-errors.type";

export type Result<Data> = {
    status: DomainStatusCode,
    data: Data,
} & OutputErrorsType

export enum DomainStatusCode {
    Success = 0,
    NotFound = 1,
    Forbidden = 2,
    Unauthorized = 3,
    BadRequest = 4
}

export const userService = {
    async createUser(body: UserInputModel): Promise<Result<string | null>>{
        const result = await this.checkUnique(body.login, body.email);

        if (result.status !== DomainStatusCode.Success) {
            return result
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(body.password, passwordSalt);

        const user: UserDBType = {
            login: body.login,
            email: body.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString()
        }

        const createdId = await userRepository.createUser(user)
        return {
            status: DomainStatusCode.Success,
            data: createdId,
            errorsMessages: []
        }
    },
    async deleteUserById(id: string): Promise<boolean> {
        return await userRepository.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false;
        }

        const passwordHash = await this._generateHash(password, user.passwordSalt);
        return user.passwordHash === passwordHash;
    },
    async checkUnique(login: string, email: string): Promise<Result<string | null>> {
        const isLoginExists = await userRepository.getUserByLogin(login)
        const isEmailExists = await userRepository.getUserByEmail(email)

        if (isLoginExists) {
            return {
                status: DomainStatusCode.BadRequest,
                data: null,
                errorsMessages: [{
                    message: 'This login has already been used.',
                    field: 'login'
                }]
            }
        }

        if (isEmailExists) {
            return {
                status: DomainStatusCode.BadRequest,
                data: null,
                errorsMessages: [{
                    message: 'This email address has already been used.',
                    field: 'email'
                }]
            }
        }

        return {
            status: DomainStatusCode.Success,
            data: null,
            errorsMessages: []
        }
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}