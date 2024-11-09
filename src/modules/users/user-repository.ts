import {UserDBType} from "../../types/user.types";
import {userCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";


export const userRepository = {
    async createUser(user: UserDBType): Promise<string> {
        const result = await userCollection.insertOne(user);
        return result.insertedId.toString();
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
        return await userCollection.findOne({
            $or: [
                { login: loginOrEmail },
                { email: loginOrEmail }
            ]
        });
    }
}