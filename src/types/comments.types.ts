import {CommentLikesDBType, LikesViewModel} from "./like.types";

export type CommentInputModel = {
    content: string;
}

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    likesInfo: LikesViewModel
}

export type CommentatorInfo = {
    userId: string;
    userLogin: string;
}

export type CommentDBType = {
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    postId: string;
    likes: CommentLikesDBType[];
    likesCount: number;
    dislikesCount: number;
}
