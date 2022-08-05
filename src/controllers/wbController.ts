import { Request, Response } from 'express';
import Comic from '../mongoose/models/comic';
import HomePage from '../mongoose/models/homepage';
import Chapter from '../mongoose/models/chapters';
import ChapterPages from '../mongoose/models/chapter-pages';
import axios from 'axios';

import { cache, getCache } from '../services/cache.service';
import {
    DEFAULT_EXPIRED_CHAPTERS,
    DEFAULT_EXPIRED_HOME_PAGE,
} from '../constants/nt';

export default function wbController() {
    const homePage = async (req: Request, res: Response) => {
        const covers = {
            'covers._id': -1,
            'covers.comicId': -1,
            'covers.comicName': -1,
            'covers.slug': -1,
            'covers.link': -1,
            'covers.animations': -1,
        };

        const comics = {
            'content.comics._id': -1,
            'content.comics.comicName': -1,
            'content.comics.tags': -1,
            'content.comics.slug': -1,
            'content.comics.verticalLogo': -1,
            'content.comics.status': -1,
            'content.comics.adultContent': -1,
        };
        const contents = {
            'content._id': -1,
            'content.comicName': -1,
            'content.slug': -1,
            'content.newestChapter': -1,
            'content.verticalLogo': -1,
            'content.adultContent': -1,
            'content.label': -1,
            'content.reviewCount': -1,
            'content.followingCount': -1,
            'content.likedCount': -1,
            'content.viewCount': -1,
            'content.categories': -1,
            'content.status': -1,
            'content.tags': -1,
            'content.comicsReviewNewest': -1,
            'content.name': -1,
            'content.categoryVietName': -1,
            ...comics,
        };

        const projection = {
            type: -1,
            typeName: -1,
            ...covers,
            ...contents,
        };

        const homepages = await HomePage.find({}, projection).sort({
            orderIndex: 1,
        });

        return res.status(200).json({
            status: true,
            data: homepages,
            total: homepages.length,
        });
    };

    const readComic = async (req: Request, res: Response) => {
        const { chapter_slug } = req.query;

        const chapter = await Chapter.findOne({
            slug: chapter_slug,
        }).select(
            '_id chapterNum slug isUnlocked chapterName comicSlug comicId chapterOrderIndex',
        );

        const pages = await ChapterPages.find({
            chapterSlug: chapter_slug,
        }).sort({
            pageNum: 1,
        });

        return res.status(200).json({
            status: true,
            data: {
                pages: pages,
                chapter: chapter,
            },
        });
    };

    const getComic = async (req: Request, res: Response) => {
        const { slug, _id } = req.query;
        const comic = await Comic.findOne({
            slug: slug,
        });

        return res.status(200).json({
            status: true,
            data: comic,
        });
    };

    const getChapters = async (req: Request, res: Response) => {
        const { comic_slug } = req.query;
        const key = `chapters-${comic_slug}`;
        const redisCacheData = await getCache(key);
        if (redisCacheData) {
            return res.status(200).json({
                status: true,
                data: JSON.parse(redisCacheData),
                total: JSON.parse(redisCacheData).length,
            });
        }

        const chapters = await Chapter.find({
            comicSlug: comic_slug,
        }).sort({
            chapterOrderIndex: 1,
        });

        await cache(key, JSON.stringify(chapters), DEFAULT_EXPIRED_CHAPTERS);
        return res.status(200).json({
            status: true,
            data: chapters,
            total: chapters.length,
        });
    };

    const testController = async (req: Request, res: Response) => {
        await axios.post(
            'https://hooks.slack.com/services/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',
            {
                text: `[ADD] Comic `,
            },
        );

        return res.status(200).json({
            status: true,
        });
    };

    return {
        homePage,
        getComic,
        readComic,
        getChapters,
        testController,
    };
}
