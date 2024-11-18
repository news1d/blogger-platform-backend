import {Request, Response} from 'express';
import {userService} from "../users/user-service";
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {LoginInputModel, LoginSuccessViewModel, MeViewModel} from "../../types/auth.types";
import {jwtService} from "../../application/jwt-service";
import {userQueryRepo} from "../users/user-queryRepo";
import {userPaginationQueries} from "../../helpers/paginations_values";

export const authController = {
    async authentication (req: Request<any, any, LoginInputModel>, res: Response<LoginSuccessViewModel>){

        console.log('loginOrEmail: ', req.body.loginOrEmail, '\npassword: ', req.body.password)
        // console.log('password: ', req.body.password)
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = userPaginationQueries(req)
        const users = await userQueryRepo.getUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
        console.log('users: ', users)

        const result = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)

        console.log('userId: ', result)
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