import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {userPaginationQueries} from "../../helpers/paginations_values";
import {userQueryRepo} from "./user-queryRepo";
import {DomainStatusCode, userService} from "./user-service";
import {UserInputModel, UserViewModel} from "../../types/user.types";
import {ObjectId} from "mongodb";
import {OutputErrorsType} from "../../types/output-errors.type";


export const userController = {
    async getUsers(req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = userPaginationQueries(req)
        const users = await userQueryRepo.getUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
        const usersCount = await userQueryRepo.getUsersCount(searchLoginTerm, searchEmailTerm)

        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount: Math.ceil(usersCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users
        })
    },
    async createUser(req: Request<any, any, UserInputModel>, res: Response<UserViewModel | null | OutputErrorsType>) {
        const result = await userService.createUser(req.body)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        const userId = result.data!
        const user = await userQueryRepo.getUserById(userId)

        res.status(HTTP_STATUSES.CREATED_201).json(user)
    },
    async deleteUserById(req: Request<{id: string}>, res: Response) {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const isDeleted = await userService.deleteUserById(req.params.id)

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}