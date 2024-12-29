import {SessionViewModel, SessionDBType} from "../../types/sessions.types";
import {SessionModel} from "../../entities/session.entity";
import {injectable} from "inversify";

@injectable()
export class SessionQueryRepo {
    async getSessions(userId: string): Promise<SessionViewModel[]> {
        const sessions = await SessionModel.find({ userId: userId }).lean();
        return sessions.map(this.mapToOutput)
    }

    mapToOutput(session: SessionDBType): SessionViewModel {
        return {
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat,
            deviceId: session.deviceId
        }
    }
}