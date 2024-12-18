import {WithId} from "mongodb";
import {SessionDBType} from "../../types/sessions.types";
import {SessionModel} from "../../entities/session.entity";

export const sessionRepository = {
    async createSession(sessions: SessionDBType): Promise<string> {
        const result = await SessionModel.create(sessions);
        return result._id.toString();
    },
    async findSessionByDeviceId(deviceId: string): Promise<WithId<SessionDBType> | null> {
        const session = await SessionModel.findOne({ deviceId: deviceId });

        if (!session) {
            return null;
        }

        return session
    },
    async updateTokenDate(deviceId: string, iat: Date, exp: Date): Promise<boolean> {
        const result = await SessionModel.updateOne({deviceId: deviceId}, {$set: {
            iat: new Date(iat),
            exp: new Date(exp),
            }})

        return result.matchedCount === 1;
    },
    async terminateOtherSessions(userId: string, deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteMany({
            userId: userId,
            deviceId: { $ne: deviceId }
        });
        return result.deletedCount > 0;
    },
    async terminateSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteOne({ deviceId: deviceId });
        return result.deletedCount === 1;
    },
}