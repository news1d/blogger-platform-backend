import {ExtendedLikesInfo, PostLikesDBType} from "./like.types";

export type PostInputModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo;
}

export type PostDBType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    likes: PostLikesDBType[];
    likesCount: number;
    dislikesCount: number;
}