import mongoose from "mongoose";
import {WithId} from "mongodb";
import {CommentDBType} from "../types/comments.types";
import {SETTINGS} from "../settings";

export const CommentSchema = new mongoose.Schema<WithId<CommentDBType>>({
    content: { type: String, required: true },
    commentatorInfo:{
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
})

export const CommentModel = mongoose.model<WithId<CommentDBType>>(SETTINGS.COLLECTION_NAME.COMMENT, CommentSchema)