import {Request, Response} from 'express';
import {testingRepository} from "./testing-repository";
import {HTTP_STATUSES} from "../../http-statuses";

export const testingController = {
    deleteAllData (req: Request, res: Response) {
        testingRepository.clearDB()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}