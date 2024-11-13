import bcrypt from 'bcrypt'
import {UserDBType, UserInputModel} from "../../types/user.types";
import {userRepository} from "./user-repository";
import {OutputErrorsType} from "../../types/output-errors.type";

export const userService = {
    async createUser(body: UserInputModel): Promise<string>{
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(body.password, passwordSalt)

        const user: UserDBType = {
            login: body.login,
            email: body.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString()
        }

        return await userRepository.createUser(user)
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
    async checkUnique(login: string, email: string): Promise<OutputErrorsType> {
        const errorObject: OutputErrorsType = {
            errorsMessages: []
        }

        const isLoginExists = await userRepository.getUserByLogin(login)
        const isEmailExists = await userRepository.getUserByEmail(email)

        if (isLoginExists) {
            errorObject.errorsMessages.push({
                message: 'This login has already been used.',
                field: 'login'
            })
        }

        if (isEmailExists) {
            errorObject.errorsMessages.push({
                message: 'This email address has already been used.',
                field: 'email'
            })
        }

        return errorObject
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}