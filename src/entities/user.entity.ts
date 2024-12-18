import mongoose from "mongoose";
import {WithId} from "mongodb";
import {UserDBType} from "../types/user.types";
import {SETTINGS} from "../settings";

export const UserSchema = new mongoose.Schema<WithId<UserDBType>>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: { type: String, default: null },
        expirationDate: { type: Date, default: null },
        isConfirmed: { type: String, required: true }
    },
    passwordRecovery: {
        recoveryCode: { type: String, default: null },
        expirationDate: { type: Date, default: null },
    }
})

export const UserModel = mongoose.model<WithId<UserDBType>>(SETTINGS.COLLECTION_NAME.USER, UserSchema)