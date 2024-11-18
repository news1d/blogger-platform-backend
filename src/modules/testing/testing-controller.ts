import {Request, Response} from 'express';
import {testingRepository} from "./testing-repository";
import {HTTP_STATUSES} from "../../helpers/http-statuses";

export const testingController = {
    async deleteAllData (req: Request, res: Response) {
        await testingRepository.clearDB()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}