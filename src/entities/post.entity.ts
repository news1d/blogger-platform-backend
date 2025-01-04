import mongoose from "mongoose";
import {WithId} from "mongodb";
import {PostDBType} from "../types/post.types";
import {SETTINGS} from "../settings";
import {LikeStatus, PostLikesDBType} from "../types/like.types";

const likeSchema = new mongoose.Schema<PostLikesDBType>({
    addedAt: { type: Date, required: true },
    status: { type: String, enum: Object.values(LikeStatus), required: true },
    userId: { type: String, required: true },
    login: { type: String, required: true },
})

export const PostSchema = new mongoose.Schema<WithId<PostDBType>>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    likes: { type: [likeSchema] },
    likesCount: { type: Number , required: true },
    dislikesCount: { type: Number , required: true },
})

export const PostModel = mongoose.model<WithId<PostDBType>>(SETTINGS.COLLECTION_NAME.POST, PostSchema)