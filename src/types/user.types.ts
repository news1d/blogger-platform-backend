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

export type UserDBType = {
    login: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string | null;
        expirationDate: Date | null;
        isConfirmed: string;
    }
}