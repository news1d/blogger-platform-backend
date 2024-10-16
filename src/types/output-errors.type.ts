export type FieldError = {
    message?: string,
    field?: string
}

export type APIErrorResult = {
    errorsMessages?: FieldError[]
}