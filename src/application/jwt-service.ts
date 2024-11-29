import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(userId: string): Promise<string>{
        return jwt.sign({userId: new ObjectId(userId), unique: Date.now()}, SETTINGS.JWT_SECRET, {expiresIn: "10s"})
    },
    async createRT(userId: string): Promise<string>{
        return jwt.sign({userId: new ObjectId(userId), unique: Date.now()}, SETTINGS.REFRESH_SECRET, {expiresIn: "20s"})
    },
    async getUserIdByToken(token: string, secret_phrase: string) {
        try {
            const result: any = jwt.verify(token, secret_phrase)
            return result.userId.toString()
        } catch (error) {
            return null
        }
    }
}