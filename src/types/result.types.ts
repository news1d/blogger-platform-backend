import {OutputErrorsType} from "./output-errors.type";
import {DomainStatusCode} from "../helpers/domain_status_code";

export type Result<Data> = {
    status: DomainStatusCode,
    data: Data,
} & OutputErrorsType