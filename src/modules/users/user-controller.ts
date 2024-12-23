import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {userPaginationQueries} from "../../helpers/paginations-values";
import {UserQueryRepo} from "./user-queryRepo";
import {UserInputModel, UserViewModel} from "../../types/user.types";
import {OutputErrorsType} from "../../types/output-errors.type";
import {UserService} from "./user-service";
import {DomainStatusCode} from "../../helpers/domain-status-code";


export class UserController {
    constructor(protected userService: UserService, protected userQueryRepo: UserQueryRepo) {}

    async getUsers(req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = userPaginationQueries(req)
        const users = await this.userQueryRepo.getUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
        const usersCount = await this.userQueryRepo.getUsersCount(searchLoginTerm, searchEmailTerm)

        res.status(HTTP_STATUSES.OK_200).json({
            pagesCount: Math.ceil(usersCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users
        })
    }

    async createUser(req: Request<any, any, UserInputModel>, res: Response<UserViewModel | null | OutputErrorsType>) {
        const result = await this.userService.createUser(req.body)

        if (result.status !== DomainStatusCode.Success) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages: result.errorsMessages})
            return;
        }

        const userId = result.data!
        const user = await this.userQueryRepo.getUserById(userId)

        res.status(HTTP_STATUSES.CREATED_201).json(user)
    }

    async deleteUserById(req: Request<{id: string}>, res: Response) {
        const isDeleted = await this.userService.deleteUserById(req.params.id)

        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
}