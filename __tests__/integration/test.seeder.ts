import {randomUUID} from "crypto";
import {add} from "date-fns";
import * as bcrypt from "bcrypt";
import {UserModel} from "../../src/entities/user.entity";

type RegisterUserPayloadType = {
    login: string,
    password: string,
    email: string,
    confirmationCode?: string,
    expirationDate?: Date,
    isConfirmed?: string,
    recoveryCode?: string,
    recoveryExpiration?: Date,
}

export type RegisterUserResultType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: string
    }
}

export const testSeeder = {
    createUserDto() {
        return {
            login: 'testing',
            email: 'test@gmail.com',
            password: 'password'
        }
    },
    createUserDtos(count: number) {
        const users = []

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                password: 'password'
            })
        }
        return users;
    },
    async insertUser({login, password, email, confirmationCode: confirmationCode, expirationDate, isConfirmed, recoveryCode: recoveryCode, recoveryExpiration: recoveryExpiration}: RegisterUserPayloadType ): Promise<RegisterUserResultType> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        const newUser = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: confirmationCode ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {
                    minutes: 30,
                }),
                isConfirmed: isConfirmed === 'confirmed' ? 'confirmed' : 'unconfirmed'
            },
            passwordRecovery: {
                recoveryCode: recoveryCode ?? randomUUID(),
                expirationDate: recoveryExpiration ?? add(new Date(), {
                    minutes: 5,})
            }
        };

        const res = await UserModel.create({...newUser});

        return {
            id: res._id.toString(),
            ...newUser
        }
    },
}