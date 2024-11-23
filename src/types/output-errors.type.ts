import {BlogInputModel} from "./blog.types";
import {PostInputModel} from "./post.types";
import {UserInputModel} from "./user.types";
import {RegisterConfCodeModel} from "./registration.types";


export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof UserInputModel | keyof RegisterConfCodeModel


export type OutputErrorsType  = {
    errorsMessages:{
        message: string,
        field: FieldNamesType
    }[]
}