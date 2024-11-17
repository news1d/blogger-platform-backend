import {blogCollection, commentCollection, postCollection, userCollection} from "../../db/mongoDb";

export const testingRepository = {
    async clearDB() {
        await blogCollection.deleteMany({});
        await postCollection.deleteMany({});
        await userCollection.deleteMany({});
        await commentCollection.deleteMany({});
    }
}