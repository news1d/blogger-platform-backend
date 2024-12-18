import mongoose from "mongoose";
import {WithId} from "mongodb";
import {SETTINGS} from "../settings";
import {RequestDBType} from "../types/request.types";

export const RequestSchema = new mongoose.Schema<WithId<RequestDBType>>({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },

})

export const RequestModel = mongoose.model<WithId<RequestDBType>>(SETTINGS.COLLECTION_NAME.REQUEST, RequestSchema)