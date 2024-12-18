import {MongoClient} from 'mongodb';
import {SETTINGS} from "../settings";
import mongoose from "mongoose";
import {BlogModel} from "../entities/blog.entity";
import {PostModel} from "../entities/post.entity";
import {UserModel} from "../entities/user.entity";
import {CommentModel} from "../entities/comment.entity";
import {BlacklistModel} from "../entities/blacklist.entity";
import {SessionModel} from "../entities/session.entity";
import {RequestModel} from "../entities/request.entity";

const client = new MongoClient(SETTINGS.MONGO_URL);
const db = client.db(SETTINGS.DB_NAME);
// export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>(SETTINGS.COLLECTION_NAME.BLOG);
// export const postCollection: Collection<PostDBType> = db.collection<PostDBType>(SETTINGS.COLLECTION_NAME.POST);
// export const userCollection: Collection<UserDBType> = db.collection<UserDBType>(SETTINGS.COLLECTION_NAME.USER);
// export const commentCollection: Collection<CommentDBType> = db.collection<CommentDBType>(SETTINGS.COLLECTION_NAME.COMMENT);
// export const blacklistCollection: Collection<BlacklistDBType> = db.collection<BlacklistDBType>(SETTINGS.COLLECTION_NAME.BLACKLIST)
// export const sessionCollection: Collection<SessionDBType> = db.collection<SessionDBType>(SETTINGS.COLLECTION_NAME.SESSION)
// export const requestCollection: Collection<RequestDBType> = db.collection<RequestDBType>(SETTINGS.COLLECTION_NAME.REQUEST)

export async function runDb(): Promise<boolean> {
    try {
        await mongoose.connect(SETTINGS.MONGO_URL + '/' + SETTINGS.DB_NAME)
        await client.connect();
        await db.command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        console.log("You successfully connected to MongoDB!");
        return true;
    } catch (e) {
        console.log(e)
        await client.close();
        await mongoose.disconnect();
        return false;
    }
}

export const clearDB = async () => {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await BlacklistModel.deleteMany({});
    await SessionModel.deleteMany({});
    await RequestModel.deleteMany({});
}
