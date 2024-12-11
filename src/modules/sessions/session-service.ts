import {sessionRepository} from "./session-repository";
import {createResult} from "../../helpers/result-function";
import {Result} from "../../types/result.types";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {SessionDBType} from "../../types/sessions.types";
import {jwtService} from "../../application/jwt-service";
import {WithId} from "mongodb";
import {SETTINGS} from "../../settings";

export const sessionService = {
    async createSession(userId: string, deviceName: string, ip: string, refreshToken: string) {
        const tokenData = await jwtService.getTokenData(refreshToken, SETTINGS.REFRESH_SECRET)

        const session: SessionDBType = {
            userId: userId,
            deviceId: tokenData!.deviceId,
            iat: tokenData!.iatDate,
            deviceName: deviceName,
            ip: ip,
            exp: tokenData!.expDate
        }

        return await sessionRepository.createSession(session);
    },
    async updateTokenDate(refreshToken: string): Promise<boolean> {
        const tokenData = await jwtService.getTokenData(refreshToken, SETTINGS.REFRESH_SECRET)
        return await sessionRepository.updateTokenDate(tokenData!.deviceId, tokenData!.iatDate, tokenData!.expDate)
    },
    async terminateOtherSessions(userId: string, deviceId: string): Promise<boolean> {
        return await sessionRepository.terminateOtherSessions(userId, deviceId);
    },
    async terminateSessionByDeviceId(userId: string, deviceId: string): Promise<Result<null>> {
        const session = await sessionRepository.findSessionByDeviceId(deviceId)

        if (!session) {
            return createResult(DomainStatusCode.NotFound)
        }

        if (userId !== session.userId) {
            return createResult(DomainStatusCode.Forbidden)
        }

        await sessionRepository.terminateSessionByDeviceId(deviceId)
        return createResult(DomainStatusCode.Success)
    },
    async findSessionByDeviceId(deviceId: string): Promise<WithId<SessionDBType> | null> {
        return await sessionRepository.findSessionByDeviceId(deviceId)
    }
}