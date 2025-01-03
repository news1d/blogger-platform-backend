import {UserDBType} from "../../types/user.types";
import {ObjectId, WithId} from "mongodb";
import {UserModel} from "../../entities/user.entity";
import {injectable} from "inversify";

@injectable()
export class UserRepository {
    async createUser(userDTO: UserDBType): Promise<string> {
        const user = new UserModel(userDTO);
        await user.save();
        return user._id.toString();
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
        const user = await UserModel.findOne({_id: new ObjectId(userId)});
        user!.emailConfirmation.isConfirmed = 'confirmed'
        await user!.save()
        return true;
    }

    async updateConfirmationCode(userId: string, newCode: string, newExpirationDate: Date): Promise<boolean> {
        const user = await UserModel.findOne({_id: new ObjectId(userId)});
        user!.emailConfirmation.confirmationCode = newCode;
        user!.emailConfirmation.expirationDate = newExpirationDate;
        await user!.save()
        return true;
    }

    async updateRecoveryCode(userId: string, newCode: string, newExpirationDate: Date): Promise<boolean> {
        const user = await UserModel.findOne({_id: new ObjectId(userId)});
        user!.passwordRecovery.recoveryCode = newCode;
        user!.passwordRecovery.expirationDate = newExpirationDate;
        await user!.save()
        return true;
    }

    async updatePassword(userId: string, passwordHash: string, passwordSalt: string){
        const user = await UserModel.findOne({_id: new ObjectId(userId)});
        user!.passwordHash = passwordHash;
        user!.passwordSalt = passwordSalt;
        await user!.save()
        return true;
    }
}