import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {SETTINGS} from "../settings";
import {v4 as uuidv4} from "uuid";

export const jwtService = {
    async createJWT(userId: string): Promise<string>{
        return jwt.sign({userId: new ObjectId(userId), unique: Date.now()}, SETTINGS.JWT_SECRET, {expiresIn: "10s"})
    },
    async createRT(userId: string): Promise<string>{
        const deviceId = uuidv4();
        return jwt.sign({userId: new ObjectId(userId), unique: Date.now(), deviceId: deviceId}, SETTINGS.REFRESH_SECRET, {expiresIn: "20s"});
    },
    async updateRT(userId: string, deviceId: string): Promise<string>{
        return jwt.sign({userId: new ObjectId(userId), unique: Date.now(), deviceId: deviceId}, SETTINGS.REFRESH_SECRET, {expiresIn: "20s"});
    },
    async getUserIdByToken(token: string, secret_phrase: string) {
        try {
            const result: any = jwt.verify(token, secret_phrase)
            return result.userId.toString()
        } catch (error) {
            return null;
        }
    },
    async getTokenData (token: string, secret_phrase: string) {
        try {
            const result: any = jwt.verify(token, secret_phrase);
            if (result) {
                const { iat, exp, deviceId } = result;
                const iatDate = new Date(iat * 1000)
                const expDate = new Date(exp * 1000)
                return { iatDate, expDate, deviceId };
            }
        } catch (error) {
            return null;
        }
    },
}