import {BlogModel} from "../../entities/blog.entity";
import {PostModel} from "../../entities/post.entity";
import {UserModel} from "../../entities/user.entity";
import {CommentModel} from "../../entities/comment.entity";
import {BlacklistModel} from "../../entities/blacklist.entity";
import {SessionModel} from "../../entities/session.entity";
import {RequestModel} from "../../entities/request.entity";

export class TestingRepository {
    async clearDB() {
        await BlogModel.deleteMany({});
        await PostModel.deleteMany({});
        await UserModel.deleteMany({});
        await CommentModel.deleteMany({});
        await BlacklistModel.deleteMany({});
        await SessionModel.deleteMany({});
        await RequestModel.deleteMany({});
    }
}