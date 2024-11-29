import {blacklistCollection} from "../db/mongoDb";
import {BlacklistDBType} from "../types/blacklist.types";


export const blacklistRepository = {
    async findToken(token: string): Promise<boolean> {
        const result = await blacklistCollection.findOne({token: token});
        return !!result
    },
    async addToken(token: BlacklistDBType): Promise<boolean> {
        const result = await blacklistCollection.insertOne(token)
        return !!result
    }
}