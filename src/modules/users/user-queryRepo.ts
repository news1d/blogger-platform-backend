import {userCollection} from "../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {UserDBType, UserViewModel} from "../../types/user.types";


export const userQueryRepo = {
    async getUsers(pageNumber: number,
                   pageSize: number,
                   sortBy: string,
                   sortDirection: 'asc' | 'desc',
                   searchLoginTerm: string | null,
                   searchEmailTerm: string | null) {

        const filter: any[] = []

        if (searchLoginTerm) {
            filter.push({ login: { $regex: searchLoginTerm, $options: "i" } });
        }

        if (searchEmailTerm) {
            filter.push({ email: { $regex: searchEmailTerm, $options: "i" } })
        }

        const query = filter.length > 0 ? { $or: filter } : {};

        const users = await userCollection
            .find(query)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        return users.map(this.mapToOutput)

    },
    async getUsersCount(searchLoginTerm: string | null, searchEmailTerm: string | null) {
        const filter: any[] = []

        if (searchLoginTerm) {
            filter.push({ login: { $regex: searchLoginTerm, $options: "i" } });
        }

        if (searchEmailTerm) {
            filter.push({ email: { $regex: searchEmailTerm, $options: "i" } });
        }

        const query = filter.length > 0 ? { $or: filter } : {};

        return userCollection.countDocuments(query)

    },
    async getUserById(id: string): Promise<UserViewModel | null> {
        const user = await userCollection.findOne({_id: new ObjectId(id)});

        if (!user) {
            return null;
        }
        return this.mapToOutput(user)
    },
    mapToOutput(user: WithId<UserDBType>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}