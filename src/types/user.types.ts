export type UserInputModel = {
    login: string;
    password: string;
    email: string;
}

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export class UserDBType {
    constructor(public login: string,
                public email: string,
                public passwordHash: string,
                public passwordSalt: string,
                public createdAt: string,
                public emailConfirmation: {
                    confirmationCode: string | null;
                    expirationDate: Date | null;
                    isConfirmed: string;
                },
                public passwordRecovery: {
                    recoveryCode: string | null;
                    expirationDate: Date | null;
                }) {}
}