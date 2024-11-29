import {blacklistRepository} from "./blacklist-repository";


export const blacklistService = {
    async findToken(token: string): Promise<boolean> {
        return await blacklistRepository.findToken(token);
    },
    async addToken(expiredToken: string): Promise<boolean> {
        const blacklistedToken = {
            token: expiredToken
        }

        return await blacklistRepository.addToken(blacklistedToken)
    }
}