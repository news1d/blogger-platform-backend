import {Request, Response} from 'express';
import {userService} from "../users/user-service";
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {LoginInputModel} from "../../types/auth.types";

export const authController = {
    async authentication (req: Request<any, any, LoginInputModel>, res: Response){
        const result = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        }
    }
}