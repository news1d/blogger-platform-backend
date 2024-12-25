export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

export type LikeInputModel = {
    likeStatus: LikeStatus
}

export type LikesViewModel = {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
}

export type LikesDBType = {
    createdAt: Date;
    status: LikeStatus;
    authorId: string;
}