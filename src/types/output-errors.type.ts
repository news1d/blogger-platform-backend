import {BlogInputModel} from "./blog.types";
import {PostInputModel} from "./post.types";


export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel

export type OutputErrorsType  = {
    errorsMessages:{
        message: string,
        field: FieldNamesType
    }[]
}