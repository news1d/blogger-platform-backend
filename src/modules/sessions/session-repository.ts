import {sessionCollection} from "../../db/mongoDb";
import {WithId} from "mongodb";
import {SessionDBType} from "../../types/sessions.types";

export const sessionRepository = {
    async createSession(sessions: SessionDBType): Promise<string> {
        const result = await sessionCollection.insertOne(sessions);
        return result.insertedId.toString();
    },
    async findSessionByDeviceId(deviceId: string): Promise<WithId<SessionDBType> | null> {
        const session = await sessionCollection.findOne({ deviceId: deviceId });

        if (!session) {
            return null;
        }

        return session
    },
    async updateTokenDate(deviceId: string, iat: Date, exp: Date): Promise<boolean> {
        const result = await sessionCollection.updateOne({deviceId: deviceId}, {$set: {
            iat: new Date(iat),
            exp: new Date(exp),
            }})

        return result.matchedCount === 1;
    },
    async terminateOtherSessions(userId: string, deviceId: string): Promise<boolean> {
        const result = await sessionCollection.deleteMany({
            userId: userId,
            deviceId: { $ne: deviceId }
        });
        return result.deletedCount > 0;
    },
    async terminateSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await sessionCollection.deleteOne({ deviceId: deviceId });
        return result.deletedCount === 1;
    },
}