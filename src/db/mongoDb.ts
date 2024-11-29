import {MongoClient, Collection} from 'mongodb';
import {SETTINGS} from "../settings";
import {BlogDBType} from "../types/blog.types";
import {PostDBType} from "../types/post.types";
import {UserDBType} from "../types/user.types";
import {CommentDBType} from "../types/comments.types";
import {BlacklistDBType} from "../types/blacklist.types";

const client = new MongoClient(SETTINGS.MONGO_URL);
const db = client.db(SETTINGS.DB_NAME);
export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>(SETTINGS.COLLECTION_NAME.BLOG);
export const postCollection: Collection<PostDBType> = db.collection<PostDBType>(SETTINGS.COLLECTION_NAME.POST);
export const userCollection: Collection<UserDBType> = db.collection<UserDBType>(SETTINGS.COLLECTION_NAME.USER);
export const commentCollection: Collection<CommentDBType> = db.collection<CommentDBType>(SETTINGS.COLLECTION_NAME.COMMENT);
export const blacklistCollection: Collection<BlacklistDBType> = db.collection<BlacklistDBType>(SETTINGS.COLLECTION_NAME.BLACKLIST)

export async function runDb(): Promise<boolean> {
    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return true;
    } catch (e) {
        console.log(e)
        await client.close();
        return false;
    }
}

export const clearDB = async () => {
    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});
    await userCollection.deleteMany({});
    await commentCollection.deleteMany({})
    await blacklistCollection.deleteMany({})
}
