import {Request, Response} from 'express';
import Comic from '../mongoose/models/comic';
import HomePage from '../mongoose/models/homepage';
import Chapter from '../mongoose/models/chapters';

import axios from "axios";
import {Error} from "mongoose";
import {log} from "util";

export default function wbController() {
    const homePage = async (req: Request, res: Response) => {

        const homepages = await HomePage.find({})
        return res.status(200).json({
            status: true,
            data: homepages
        });
    }

    const getComic = async (req: Request, res: Response) => {
        const {slug, _id} = req.query;
        const response = await axios.get(`/${slug}/${_id}.json`, {
            baseURL: 'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh',
            params: {
                slug: slug,
            }
        })

        const comic = response.data.pageProps.data.comic
        const chapters = response.data.pageProps.data.chapters
        const comicsRelated = response.data.pageProps.data.comicsRelated

        return res.status(200).json({
            status: true,
            data: {
                comic: comic,
                chapters: chapters,
                comicsRelated: comicsRelated
            }
        })
    }

    const asyncComic = async (req: Request, res: Response) => {
        const {slug, _id} = req.query;
        const response = await axios.get(`/${slug}/${_id}.json`, {
            baseURL: 'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh',
            params: {
                slug: slug,
            }
        })

        const comic = response.data.pageProps.data.comic
        const chapters = response.data.pageProps.data.chapters
        // const comicsRelated = response.data.pageProps.data.comicsRelated

        await Comic.findOneAndUpdate({slug: slug}, comic)
        Chapter.find({
            slug: {
                $in: chapters.map((item: any) => item.slug) // Check if item_id is one of the array values
            }
        }).then((documents) => {
            // documents is all the items that already exists
            const newItems = chapters.filter((item: any) => !documents.find((doc) => doc.slug === item.slug));
            return Chapter.insertMany(newItems, {ordered: false})
                .then((docs: any) => {
                    const n = docs ? docs.length : 0
                    docs.map(() => {
                        /* Do something */
                    })

                    return res.status(200).json({
                        status: true,
                        message: `New items imported ${n} / ${chapters.length}`
                    })
                })
                .catch(() => {
                    console.log('`Error importing items.')
                });
        }).catch(() => {
            console.log('Error importing items.')
        });

        return res.status(200).json({
            status: true,
        });
    }

    return {
        homePage,
        getComic,
        asyncComic
    }
}