export type PostInputModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export type PostDBType = {
    _id: string | undefined;
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}