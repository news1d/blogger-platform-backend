import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {DomainStatusCode} from "../../helpers/domain-status-code";
import {jwtService} from "../../application/jwt-service";
import {SETTINGS} from "../../settings";
import {SessionService} from "./session-service";
import {SessionQueryRepo} from "./session-queryRepo";

export class SessionController {
    constructor(protected sessionService: SessionService, protected sessionQueryRepo: SessionQueryRepo ) {}

    async getSessions(req: Request, res: Response) {
        const sessions = await this.sessionQueryRepo.getSessions(req.userId!)
        res.status(HTTP_STATUSES.OK_200).json(sessions)
    }

    async terminateOtherSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const tokenData = await jwtService.getTokenData(refreshToken, SETTINGS.REFRESH_SECRET);

        await this.sessionService.terminateOtherSessions(req.userId!, tokenData!.deviceId)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async terminateSessionByDeviceId(req: Request<{deviceId: string}>, res: Response) {
        const result = await this.sessionService.terminateSessionByDeviceId(req.userId!, req.params.deviceId)

        if (result.status === DomainStatusCode.NotFound) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        if (result.status === DomainStatusCode.Forbidden) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}