import mongoose from "mongoose";
import {WithId} from "mongodb";
import {SessionDBType} from "../types/sessions.types";
import {SETTINGS} from "../settings";

export const SessionSchema = new mongoose.Schema<WithId<SessionDBType>>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    iat: { type: Date, required: true },
    deviceName: { type: String, required: true },
    ip: { type: String, required: true },
    exp: { type: Date, required: true },
})

export const SessionModel = mongoose.model<WithId<SessionDBType>>(SETTINGS.COLLECTION_NAME.SESSION, SessionSchema)