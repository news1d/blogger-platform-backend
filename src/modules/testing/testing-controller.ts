import {Request, Response} from 'express';
import {HTTP_STATUSES} from "../../helpers/http-statuses";
import {TestingRepository} from "./testing-repository";
import {inject, injectable} from "inversify";

@injectable()
export class TestingController {
    constructor(@inject(TestingRepository) protected testingRepository: TestingRepository) {}

    async deleteAllData (req: Request, res: Response) {
        await this.testingRepository.clearDB()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}