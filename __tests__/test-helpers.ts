import {BlogInputModel} from "../src/types/blog.types";
import {PostInputModel} from "../src/types/post.types";
import request from 'supertest';
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {HTTP_STATUSES} from "../src/http-statuses";
import {blogRepository} from "../src/modules/blogs/blog-repository";
import {db} from "../src/db/db";

const codedAuth = 'YWRtaW46cXdlcnR5'
export const authData = {'Authorization': 'Basic '+ codedAuth}


export const blogData = {
    validData: {
        name: 'some name',
        description: 'some description',
        websiteUrl: 'https://backend.com'
    },
    validDataForUpdate: {
        name: 'some new name',
        description: 'some new description',
        websiteUrl: 'https://backend.com'
    },
    dataWithOutName: {
        name: '  ',
        description: 'some description',
        websiteUrl: 'https://backend.com'
    },
    dataWithBigName: {
        name: 'some name some name some name',
        description: 'some description',
        websiteUrl: 'https://backend.com'
    },
    dataWithoutDescription: {
        name: 'some name',
        description: '  ',
        websiteUrl: 'https://backend.com'
    },
    dataWithBigDescription: {
        name: 'some name',
        description: 'В уютном кафе, наполненном ароматом свежесваренного кофе и корицы, сидела молодая женщина. ' +
            'Ее взгляд был устремлен в окно, где падал легкий осенний дождь, рисуя на асфальте темные полосы. ' +
            'В руках она держала книгу, но слова на страницах не находили отклика в ее душе. ' +
            'Она была погружена в свои мысли, перебирая в памяти события прошедшего дня. ' +
            'Встреча с любимым человеком, наполненная радостью и нежностью, теперь казалась далеким сном. ' +
            'Сердце ее сжималось от тоски, а глаза увлажнялись от невысказанных чувств. ' +
            'Она понимала, что жизнь полна перемен, и не всегда все идет по плану. ' +
            'Но в этот момент ей хотелось лишь одного - чтобы время остановилось, ' +
            'чтобы она могла насладиться этой хрупкой красотой момента, когда капли дождя, словно бриллианты, сверкали на мокром асфальте. ',
        websiteUrl: 'https://backend.com'
    },
    dataWithoutUrl: {
        name: 'some name',
        description: 'some description',
        websiteUrl: '  '
    },
    dataWithBigUrl: {
        name: 'some name',
        description: 'some description',
        websiteUrl: 'https://www.example.com/' +
            'product/category/subcategory/item/' +
            '12345678901234567890/details?ref=abcd1234efgh5678ijkl9012mnopqrst'
    },
    dataWithInvalidUrl: {
        name: 'some name',
        description: 'some description',
        websiteUrl: 'www.someurl.com'
    }
}

export const postData: Record<string, PostInputModel> = {
    validData: {
        title: 'some title',
        shortDescription: 'some description',
        content: 'some content',
        blogId: db.blogs[0].id
    },
    dataWithOutTitle: {
        title: '   ',
        shortDescription: 'some description',
        content: 'some content',
        blogId: db.blogs[0].id
    },
    dataWithBigTitle: {
        title: 'some title some title some title',
        shortDescription: 'some description',
        content: 'some content',
        blogId: db.blogs[0].id
    },
    dataWithoutShortDescription: {
        title: 'some title',
        shortDescription: '    ',
        content: 'some content',
        blogId: db.blogs[0].id
    },
    dataWithBigShortDescription: {
        title: 'some description',
        shortDescription: 'some description some description' +
            'some description some description some description' +
            'some description some description some description',
        content: 'some content',
        blogId: db.blogs[0].id
    },
    dataWithoutContent: {
        title: 'some title',
        shortDescription: 'some description',
        content: '   ',
        blogId: db.blogs[0].id
    },
    dataWithBigContent: {
        title: 'some title',
        shortDescription: 'some description',
        content: 'В уютном кафе, наполненном ароматом свежесваренного кофе и корицы, сидела молодая женщина. ' +
            'Ее взгляд был устремлен в окно, где падал легкий осенний дождь, рисуя на асфальте темные полосы. ' +
            'В руках она держала книгу, но слова на страницах не находили отклика в ее душе. ' +
            'Она была погружена в свои мысли, перебирая в памяти события прошедшего дня. ' +
            'Встреча с любимым человеком, наполненная радостью и нежностью, теперь казалась далеким сном. ' +
            'Сердце ее сжималось от тоски, а глаза увлажнялись от невысказанных чувств. ' +
            'Она понимала, что жизнь полна перемен, и не всегда все идет по плану. ' +
            'Но в этот момент ей хотелось лишь одного - чтобы время остановилось, ' +
            'чтобы она могла насладиться этой хрупкой красотой момента, когда капли дождя, словно бриллианты, сверкали на мокром асфальте. ' +
            'В уютном кафе, наполненном ароматом свежесваренного кофе и корицы, сидела молодая женщина. ' +
            'Ее взгляд был устремлен в окно, где падал легкий осенний дождь, рисуя на асфальте темные полосы. ' +
            'В руках она держала книгу, но слова на страницах не находили отклика в ее душе. ' +
            'Она была погружена в свои мысли, перебирая в памяти события прошедшего дня. ' +
            'Встреча с любимым человеком, наполненная радостью и нежностью, теперь казалась далеким сном. ' +
            'Сердце ее сжималось от тоски, а глаза увлажнялись от невысказанных чувств. ' +
            'Она понимала, что жизнь полна перемен, и не всегда все идет по плану. ' +
            'Но в этот момент ей хотелось лишь одного - чтобы время остановилось, ' +
            'чтобы она могла насладиться этой хрупкой красотой момента, когда капли дождя, словно бриллианты, сверкали на мокром асфальте. ',
        blogId: db.blogs[0].id
    },
    dataWithoutBlogId: {
        title: 'some title',
        shortDescription: 'some description',
        content: 'some content',
        blogId: '  '
    },
    dataWithInvalidBlogId: {
        title: 'some title',
        shortDescription: 'some description',
        content: 'some content',
        blogId: '-1'
    },
    validDataForUpdate: {
        title: 'some new title',
        shortDescription: 'some new description',
        content: 'some new content',
        blogId: db.blogs[0].id
    }


}

export const blogsTestManager = {
    async createBlog(data: BlogInputModel){
        const response = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set(authData)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdBlog = response.body;
        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
        })

        return response;
    }
}

export const postsTestManager = {
    async createPost(data: PostInputModel) {
        const response = await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set(authData)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        const createdPost = response.body;
        expect(createdPost).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: blogRepository.getBlogById(data.blogId)!.name
        })

        return response;
    }

}