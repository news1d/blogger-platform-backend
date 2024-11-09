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
    async getUserByLogin(login: string): Promise<UserViewModel | null> {
        console.log("Executing getUserByLogin:", login);

        const user = await userCollection.findOne({ login: login })

        if (!user) {
            console.log("getUserByLogin: No user found for login:", login);
            return null
        }

        const output = this.mapToOutput(user);
        console.log("getUserByLogin: User found:", output); // Лог, если пользователь найден
        return output
    },
    async getUserByEmail(email: string): Promise<UserViewModel | null> {
        const user = await userCollection.findOne({email: email})

        if (!user) {
            return null
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