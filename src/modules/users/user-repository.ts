import {UserDBType} from "../../types/user.types";
import {userCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";


export const userRepository = {
    async createUser(user: UserDBType): Promise<string> {
        const result = await userCollection.insertOne(user);
        return result.insertedId.toString();
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    },
    async getUserById(id: string): Promise<WithId<UserDBType> | null> {
        const user = await userCollection.findOne({_id: new ObjectId(id)});

        if (!user) {
            return null;
        }

        return user
    },
    async getUserByLogin(login: string): Promise<UserDBType | null> {
        const user = await userCollection.findOne({ login: login })

        if (!user) {
            return null
        }
        return user
    },
    async getUserByEmail(email: string): Promise<WithId<UserDBType> | null> {
        const user = await userCollection.findOne({ email: email })

        if (!user) {
            return null
        }
        return user
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType> | null> {
        return await userCollection.findOne({
            $or: [
                { login: loginOrEmail },
                { email: loginOrEmail }
            ]
        });
    },
    async findUserByConfirmationCode(code: string): Promise<WithId<UserDBType> | null> {
        return await userCollection.findOne({ "emailConfirmation.confirmationCode": code })
    },
    async updateConfirmation(userId: string): Promise<boolean> {
        const result = await userCollection.updateOne({_id: new ObjectId(userId)}, {$set: {
            "emailConfirmation.isConfirmed": 'confirmed',
            }})

        return result.matchedCount === 1;
    },
    async updateConfirmationCode(userId: string, newCode: string, newExpirationDate: Date): Promise<boolean> {
        const result = await userCollection.updateOne({_id: new ObjectId(userId)}, {$set: {
            "emailConfirmation.confirmationCode": newCode,
            "emailConfirmation.expirationDate": newExpirationDate
            }})
        return result.matchedCount === 1;
    }
}