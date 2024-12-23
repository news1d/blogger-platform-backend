import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {TestingRepository} from "./testing-repository";

export class TestingController {
    constructor(protected testingRepository: TestingRepository) {}

    async deleteAllData (req: Request, res: Response) {
        await this.testingRepository.clearDB()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}