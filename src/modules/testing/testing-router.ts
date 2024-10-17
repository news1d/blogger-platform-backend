import {Router} from "express";
import {testingController} from "./testing-controller";

export const testingRouter = Router();

testingRouter.delete('/all-data', testingController.deleteAllData);