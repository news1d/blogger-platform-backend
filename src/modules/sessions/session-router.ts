import {Router} from "express";
import {refreshTokenMiddleware} from "../../middlewares/authorization-middleware";
import {container} from "../../composition-root";
import {SessionController} from "./session-controller";

const sessionController = container.resolve(SessionController);

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