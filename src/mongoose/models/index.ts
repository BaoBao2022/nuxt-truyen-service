export type Manga = {
    name: string;
    status: string;
    author: string;
    review: string;
    otherName: string;
    thumbnail: string;
    updatedAt: string;
    view: string;
    follow: string;
    comment: string;
    slug: string;
    genres: string[];
    chapSuggests: [{
        chapId: string;
        chapNumber: string;
        updatedAt: string;
    }];
};
