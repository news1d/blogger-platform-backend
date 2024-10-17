import {BlogInputModel} from "./blog.types";
import {PostInputModel} from "./post.type";


export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel

export type OutputErrorsType  = {
    errorsMessages:{
        message: string,
        field: FieldNamesType
    }[]
}