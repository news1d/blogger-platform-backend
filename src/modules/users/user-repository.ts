import {UserDBType} from "../../types/user.types";
import {ObjectId, WithId} from "mongodb";
import {UserModel} from "../../entities/user.entity";

export class UserRepository {
    async createUser(user: UserDBType): Promise<string> {
        const result = await UserModel.create(user);
        return result._id.toString();
    }

    async deleteUserById(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async getUserById(id: string): Promise<WithId<UserDBType> | null> {
        const user = await UserModel.findOne({_id: new ObjectId(id)});

        if (!user) {
            return null;
        }

        return user
    }

    async getUserByLogin(login: string): Promise<UserDBType | null> {
        const user = await UserModel.findOne({ login: login })

        if (!user) {
            return null
        }
        return user
    }

    async getUserByEmail(email: string): Promise<WithId<UserDBType> | null> {
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return null
        }
        return user
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType> | null> {
        return UserModel.findOne({
            $or: [
                {login: loginOrEmail},
                {email: loginOrEmail}
            ]
        });
    }

    async findUserByConfirmationCode(code: string): Promise<WithId<UserDBType> | null> {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code});
    }

    async findUserByRecoveryCode(code: string): Promise<WithId<UserDBType> | null> {
        return UserModel.findOne({"passwordRecovery.recoveryCode": code});
    }

    async updateConfirmation(userId: string): Promise<boolean> {
        const result = await UserModel.updateOne({_id: new ObjectId(userId)}, {$set: {
            "emailConfirmation.isConfirmed": 'confirmed',
            }})

        return result.matchedCount === 1;
    }

    async updateConfirmationCode(userId: string, newCode: string, newExpirationDate: Date): Promise<boolean> {
        const result = await UserModel.updateOne({_id: new ObjectId(userId)}, {$set: {
            "emailConfirmation.confirmationCode": newCode,
            "emailConfirmation.expirationDate": newExpirationDate
            }})
        return result.matchedCount === 1;
    }

    async updateRecoveryCode(userId: string, newCode: string, newExpirationDate: Date): Promise<boolean> {
        const result = await UserModel.updateOne({_id: new ObjectId(userId)}, {$set: {
                "passwordRecovery.recoveryCode": newCode,
                "passwordRecovery.expirationDate": newExpirationDate
            }})
        return result.matchedCount === 1;
    }

    async updatePassword(userId: string, passwordHash: string, passwordSalt: string){
        const result = await UserModel.updateOne({_id: new ObjectId(userId)}, {$set: {
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
            }})
        return result.matchedCount === 1;
    }
}