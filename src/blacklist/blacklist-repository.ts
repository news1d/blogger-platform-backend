import {BlacklistDBType} from "../types/blacklist.types";
import {BlacklistModel} from "../entities/blacklist.entity";


export const blacklistRepository = {
    async findToken(token: string): Promise<boolean> {
        const result = await BlacklistModel.findOne({token: token});
        return !!result
    },
    async addToken(token: BlacklistDBType): Promise<boolean> {
        const result = await BlacklistModel.create(token)
        return !!result
    }
}