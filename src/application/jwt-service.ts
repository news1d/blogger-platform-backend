import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(userId: string): Promise<string>{
        return jwt.sign({userId: new ObjectId(userId)}, SETTINGS.JWT_SECRET, {expiresIn: "1h"})
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result.userId.toString()
        } catch (error) {
            return null
        }
    }
}