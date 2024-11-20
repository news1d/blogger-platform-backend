import {FieldNamesType} from "../types/output-errors.type";
import {Result} from "../types/result.types";
import {DomainStatusCode} from "./domain-status-code";


export const createResult = <Data = null>(
    status: DomainStatusCode,
    data: Data | null = null,
    errorsMessages: { message: string; field: FieldNamesType }[] = []
): Result<Data> => ({
    status,
    data,
    errorsMessages,
});



