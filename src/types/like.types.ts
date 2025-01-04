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

export type CommentLikesDBType = {
    createdAt: Date;
    status: LikeStatus;
    authorId: string;
}

export type PostLikesDBType = {
    addedAt: Date;
    status: LikeStatus;
    userId: string;
    login: string;
}

export type ExtendedLikesInfo = {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: NewestLikes[] | null;

}

export type NewestLikes = {
    addedAt: string;
    userId: string
    login: string;
}