import {Router} from "express";
import {sessionController} from "./session-controller";
import {refreshTokenMiddleware} from "../../middlewares/authorization-middleware";


export const sessionRouter = Router();

sessionRouter.get('/devices',
    refreshTokenMiddleware,
    sessionController.getSessions)
sessionRouter.delete('/devices',
    refreshTokenMiddleware,
    sessionController.terminateOtherSessions)
sessionRouter.delete('/devices/:deviceId',
    refreshTokenMiddleware,
    sessionController.terminateSessionByDeviceId)