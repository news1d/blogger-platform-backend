import {Router} from "express";
import {refreshTokenMiddleware} from "../../middlewares/authorization-middleware";
import {sessionController} from "../../composition-root";


export const sessionRouter = Router();

sessionRouter.get('/devices',
    refreshTokenMiddleware,
    sessionController.getSessions.bind(sessionController))
sessionRouter.delete('/devices',
    refreshTokenMiddleware,
    sessionController.terminateOtherSessions.bind(sessionController))
sessionRouter.delete('/devices/:deviceId',
    refreshTokenMiddleware,
    sessionController.terminateSessionByDeviceId.bind(sessionController))