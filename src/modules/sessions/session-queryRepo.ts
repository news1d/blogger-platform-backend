import {sessionCollection} from "../../db/mongoDb";
import {SessionViewModel, SessionDBType} from "../../types/sessions.types";

export const sessionQueryRepo = {
    async getSessions(userId: string): Promise<SessionViewModel[]> {
        const sessions = await sessionCollection.find({ userId: userId }).toArray();
        return sessions.map(this.mapToOutput)
    },
    mapToOutput(session: SessionDBType): SessionViewModel {
        return {
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat,
            deviceId: session.deviceId
        }
    }
}