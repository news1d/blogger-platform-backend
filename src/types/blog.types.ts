export type BlogInputModel = {
    name: string;
    description: string;
    websiteUrl: string;
}

export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export type BlogDBType = {
    _id: string | undefined;
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}