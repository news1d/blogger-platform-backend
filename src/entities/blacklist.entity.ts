import mongoose from "mongoose";
import {WithId} from "mongodb";
import {BlacklistDBType} from "../types/blacklist.types";
import {SETTINGS} from "../settings";

export const BlacklistSchema = new mongoose.Schema<WithId<BlacklistDBType>>({
    token: { type: String, required: true }
})

export const BlacklistModel = mongoose.model<WithId<BlacklistDBType>>(SETTINGS.COLLECTION_NAME.BLACKLIST, BlacklistSchema)