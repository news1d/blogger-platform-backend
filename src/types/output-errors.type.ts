import {BlogInputModel} from "./blog.types";
import {PostInputModel} from "./post.types";
import {UserInputModel} from "./user.types";
import {RegisterConfCodeModel} from "./registration.types";
import {NewPasswordRecoveryInputModel} from "./auth.types";
import {LikeInputModel} from "./like.types";


export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof UserInputModel | keyof RegisterConfCodeModel | keyof NewPasswordRecoveryInputModel | keyof LikeInputModel;


export type OutputErrorsType  = {
    errorsMessages:{
        message: string,
        field: FieldNamesType
    }[]
}