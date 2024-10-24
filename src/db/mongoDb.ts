import {MongoClient, Collection} from 'mongodb';
import {SETTINGS} from "../settings";
import {BlogDBType} from "../types/blog.types";
import {PostDBType} from "../types/post.types";

const client = new MongoClient(SETTINGS.MONGO_URL);
const db = client.db(SETTINGS.DB_NAME);
export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>(SETTINGS.COLLECTION_NAME.BLOG)
export const postCollection: Collection<PostDBType> = db.collection<PostDBType>(SETTINGS.COLLECTION_NAME.POST)

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
}
