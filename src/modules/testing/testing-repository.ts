import {db} from "../../db/db";

export const testingRepository = {
    clearDB() {
        db.blogs = []
        db.posts = []
    }
}