import {NextFunction, Response, Request} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../../http-statuses";
import {FieldNamesType, OutputErrorsType} from "../../types/output-errors.type";


export const errorsResultMiddleware = (req: Request, res: Response<OutputErrorsType>, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const eArray = errors.array({onlyFirstError: true}) as { path: FieldNamesType, msg: string }[]
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorsMessages: eArray
                .map(err => ({
                    message: err.msg,
                    field: err.path
                }))
        })
        return;
    } else {
        next();
    }
}