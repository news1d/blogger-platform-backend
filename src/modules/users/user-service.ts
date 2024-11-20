import bcrypt from 'bcrypt'
import {UserDBType, UserInputModel} from "../../types/user.types";
import {userRepository} from "./user-repository";
import {WithId} from "mongodb";
import {Result} from "../../types/result.types";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {createResult} from "../../helpers/result-function";

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

        return createResult(DomainStatusCode.Success, createdId)
    },
    async getUserById(userId: string): Promise<WithId<UserDBType> | null> {
        return userRepository.getUserById(userId)
    },
    async deleteUserById(id: string): Promise<boolean> {
        return await userRepository.deleteUserById(id)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null;
        }

        const passwordHash = await this._generateHash(password, user.passwordSalt);

        if (user.passwordHash === passwordHash) {
            return user._id.toString()
        } else {
            return null
        }
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
        return await bcrypt.hash(password, salt);
    }
}