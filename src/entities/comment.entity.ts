import mongoose from "mongoose";
import {WithId} from "mongodb";
import {CommentDBType} from "../types/comments.types";
import {SETTINGS} from "../settings";
import {CommentLikesDBType, LikeStatus} from "../types/like.types";

const likeSchema = new mongoose.Schema<CommentLikesDBType>({
    createdAt: { type: Date, required: true },
    status: { type: String, enum: Object.values(LikeStatus), required: true },
    authorId: { type: String, required: true },
})

export const CommentSchema = new mongoose.Schema<WithId<CommentDBType>>({
    content: { type: String, required: true },
    commentatorInfo:{
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    likes: { type: [likeSchema] },
    likesCount: { type: Number , required: true },
    dislikesCount: { type: Number , required: true },
})

export const CommentModel = mongoose.model<WithId<CommentDBType>>(SETTINGS.COLLECTION_NAME.COMMENT, CommentSchema)