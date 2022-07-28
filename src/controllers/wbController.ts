import { Request, Response } from 'express';
import Comic from '../mongoose/models/comic';
import HomePage from '../mongoose/models/homepage';
import Chapter from '../mongoose/models/chapters';

import axios from 'axios';
import { cache, getCache } from '../services/cache.service';
import { DEFAULT_EXPIRED_HOME_PAGE } from '../constants/nt';

export default function wbController() {
    const homePage = async (req: Request, res: Response) => {
        const key = 'home-page';
        const redisCacheData = await getCache(key);
        if (redisCacheData) {
            return res.status(200).json({
                status: true,
                data: JSON.parse(redisCacheData),
                total: JSON.parse(redisCacheData).length,
            });
        }

        const homepages = await HomePage.find({}).limit(10);
        await cache(key, JSON.stringify(homepages), DEFAULT_EXPIRED_HOME_PAGE);

        return res.status(200).json({
            status: true,
            data: homepages,
            total: homepages.length,
        });
    };

    const readComic = async (req: Request, res: Response) => {
        const { slug, _id } = req.query;
        const response = await axios.get(`/${slug}/${_id}.json`, {
            baseURL:
                'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh-chapter',
            params: {
                slug: slug,
            },
        });

        // let pages = response.data.pageProps.data.pages;

        // pages = pages.map((obj: any) => ({ ...obj, chapter_slug: slug }))

        const info = response.data.pageProps.data;

        return res.status(200).json({
            status: true,
            data: info,
        });
    };

    const getComic = async (req: Request, res: Response) => {
        const { slug, _id } = req.query;
        const response = await axios.get(`/${slug}/${_id}.json`, {
            baseURL:
                'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh',
            params: {
                slug: slug,
            },
        });

        const comic = response.data.pageProps.data.comic;
        delete comic['chaptersRepresentData'];
        // const chapters = response.data.pageProps.data.chapters
        // const comicsRelated = response.data.pageProps.data.comicsRelated

        return res.status(200).json({
            status: true,
            data: {
                comic: comic,
                // chapters: chapters,
                // comicsRelated: comicsRelated
            },
        });
    };

    const asyncComic = async (req: Request, res: Response) => {
        const { slug, _id } = req.query;
        const response = await axios.get(`/${slug}/${_id}.json`, {
            baseURL:
                'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh',
            params: {
                slug: slug,
            },
        });

        const comic = response.data.pageProps.data.comic;
        const chapters = response.data.pageProps.data.chapters;
        // const comicsRelated = response.data.pageProps.data.comicsRelated

        await Comic.findOneAndUpdate({ slug: slug }, comic);
        Chapter.find({
            slug: {
                $in: chapters.map((item: any) => item.slug), // Check if item_id is one of the array values
            },
        })
            .then((documents) => {
                // documents is all the items that already exists
                const newItems = chapters.filter(
                    (item: any) =>
                        !documents.find((doc) => doc.slug === item.slug),
                );
                return Chapter.insertMany(newItems, { ordered: false })
                    .then((docs: any) => {
                        const n = docs ? docs.length : 0;
                        docs.map(() => {
                            /* Do something */
                        });

                        return res.status(200).json({
                            status: true,
                            message: `New items imported ${n} / ${chapters.length}`,
                        });
                    })
                    .catch(() => {
                        console.log('`Error importing items.');
                    });
            })
            .catch(() => {
                console.log('Error importing items.');
            });

        return res.status(200).json({
            status: true,
        });
    };

    const getChapters = async (req: Request, res: Response) => {
        const { comic_id, comic_slug } = req.query;
        const url = `/${comic_id}/chapters`;
        console.log('urlllll', url);
        const response = await axios.get(url, {
            baseURL: 'https://api.funtoon.vn/api/v1/comics',
            headers: {
                platform: 'web',
            },
        });

        const chapters = response.data.data;
        Chapter.find({
            slug: {
                $in: chapters.map((item: any) => item.slug), // Check if item_id is one of the array values
            },
        })
            .then((documents) => {
                // documents is all the items that already exists
                let newItems = chapters.filter(
                    (item: any) =>
                        !documents.find((doc) => doc.slug === item.slug),
                );
                newItems = newItems.map((chap: any) => ({
                    ...chap,
                    comic_id: comic_id,
                    comic_slug: comic_slug,
                }));
                Chapter.insertMany(newItems, { ordered: false })
                    .then((docs: any) => {
                        const n = docs ? docs.length : 0;
                        docs.map(() => {
                            /* Do something */
                        });
                    })
                    .catch(() => {
                        console.log('`Error importing items.');
                    });
            })
            .catch(() => {
                console.log('Error importing items.');
            });

        return res.status(200).json({
            status: true,
            data: response.data.data,
        });
    };

    return {
        homePage,
        getComic,
        asyncComic,
        readComic,
        getChapters,
    };
}
