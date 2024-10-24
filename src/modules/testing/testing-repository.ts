import {blogCollection, postCollection} from "../../db/mongoDb";

export const testingRepository = {
    async clearDB() {
        await blogCollection.deleteMany({});
        await postCollection.deleteMany({});
    }
}