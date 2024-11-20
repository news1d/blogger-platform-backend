import {OutputErrorsType} from "./output-errors.type";
import {DomainStatusCode} from "../helpers/domain-status-code";

export type Result<Data> = {
    status: DomainStatusCode,
    data: Data | null,
} & OutputErrorsType