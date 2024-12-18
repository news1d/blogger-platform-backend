import mongoose from 'mongoose'
import { BlogDBType } from "../types/blog.types";
import { WithId } from "mongodb";
import {SETTINGS} from "../settings";

export const BlogSchema = new mongoose.Schema<WithId<BlogDBType>>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
})
export const BlogModel = mongoose.model<WithId<BlogDBType>>(SETTINGS.COLLECTION_NAME.BLOG, BlogSchema)