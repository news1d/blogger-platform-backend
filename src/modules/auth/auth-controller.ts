import {Request, Response} from 'express';
import {userService} from "../users/user-service";
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {LoginInputModel, LoginSuccessViewModel, MeViewModel} from "../../types/auth.types";
import {jwtService} from "../../application/jwt-service";

export const authController = {
    async authentication (req: Request<any, any, LoginInputModel>, res: Response<LoginSuccessViewModel>){
        const result = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return;
        }

        const token = await jwtService.createJWT(result)
        res.status(HTTP_STATUSES.OK_200).json({accessToken: token})
    },
    async getMyInfo(req: Request, res: Response<MeViewModel>){
        const myInfo = await userService.getUserById(req.userId!);
        res.status(HTTP_STATUSES.OK_200).json({
            email: myInfo!.email,
            login: myInfo!.login,
            userId: myInfo!._id.toString(),
        })
    }
}