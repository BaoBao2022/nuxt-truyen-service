"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cache_service_1 = require("../services/cache.service");
const nt_1 = require("../constants/nt");
const Nt_model_1 = tslib_1.__importDefault(require("../models/Nt.model"));
const nt_2 = require("../types/nt");
const baseUrl = process.env.NT_SOURCE_URL;
const Nt = Nt_model_1.default.Instance(baseUrl);
function ntController() {
    // const testRoute = async (
    //     req: Request,
    //     res: Response,
    //     next: NextFunction,
    // ) => {
    //     const dataTest = await Nt.testModel();
    //     return res.status(200).json({
    //         data: dataTest,
    //     });
    // };
    const advancedSearch = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { genres, minchapter, top, page, status, gender } = req.query;
        const _genres = genres ? genres : '-1';
        const _gender = gender ? gender : -1;
        const _status = status ? nt_2.MANGA_STATUS[status] : -1;
        const _top = top ? nt_2.MANGA_SORT[top] : 0;
        const _minChapter = minchapter ? minchapter : 1;
        const _page = page ? page : 1;
        const key = `${nt_1.KEY_CACHE_ADVANCED_MANGA}${_genres}${_minChapter}${_top}${_page}${_status}${_gender}`;
        const redisData = yield (0, cache_service_1.getCache)(key);
        if (!redisData) {
            console.log('cache miss');
            const { mangaData, totalPages } = yield Nt.advancedSearch(_genres, _minChapter, _top, _page, _status, _gender);
            if (!mangaData.length) {
                return res.status(404).json({ success: false });
            }
            return res.status(200).json({
                success: true,
                data: mangaData,
                totalPages,
                hasPrevPage: Number(page) > 1 ? true : false,
                hasNextPage: Number(page) < Number(totalPages) ? true : false,
            });
        }
        const { mangaData, totalPages } = JSON.parse(String(redisData));
        if (!mangaData.length)
            return res.status(404).json({ success: false });
        return res.status(200).json({
            success: true,
            data: mangaData,
            totalPages: totalPages,
            hasPrevPage: Number(page) > 1 ? true : false,
            hasNextPage: Number(page) < Number(totalPages) ? true : false,
        });
    });
    const getNewUpdatedManga = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { page } = req.query;
        const _page = page !== undefined ? page : 1;
        const key = `${nt_1.KEY_CACHE_NEW_UPDATED_MANGA}${_page}`;
        const redisData = yield (0, cache_service_1.getCache)(key);
        if (!redisData) {
            const { mangaData, totalPages } = yield Nt.getNewUpdatedManga(_page);
            if (!mangaData.length) {
                return res.status(404).json({ success: false });
            }
            return res.status(200).json({
                success: true,
                data: mangaData,
                totalPages,
                hasPrevPage: Number(page) > 1 ? true : false,
                hasNextPage: Number(page) < Number(totalPages) ? true : false,
            });
        }
        const { mangaData, totalPages } = JSON.parse(String(redisData));
        if (!mangaData.length)
            return res.status(404).json({ success: false });
        return res.status(200).json({
            success: true,
            data: mangaData,
            totalPages: totalPages,
            hasPrevPage: Number(page) > 1 ? true : false,
            hasNextPage: Number(page) < Number(totalPages) ? true : false,
        });
    });
    const filtersManga = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { page, genres, top, status } = req.query;
        let key = '';
        //cache data for home page:::
        if (genres === 'manga-112' && top) {
            key = `${nt_1.KEY_CACHE_FILTERS_MANGA}${page !== undefined ? page : 1}${genres}${nt_2.MANGA_SORT[top]}`;
        }
        const redisData = yield (0, cache_service_1.getCache)(key);
        if (!redisData) {
            const { mangaData, totalPages } = yield Nt.filtersManga(genres !== undefined ? genres : null, page !== undefined ? page : null, top !== undefined ? nt_2.MANGA_SORT[top] : null, status !== undefined ? nt_2.MANGA_STATUS[status] : -1);
            if (!mangaData.length) {
                return res.status(404).json({ success: false });
            }
            return res.status(200).json({
                success: true,
                data: mangaData,
                totalPages,
                hasPrevPage: Number(page) > 1 ? true : false,
                hasNextPage: Number(page) < Number(totalPages) ? true : false,
            });
        }
        const { mangaData, totalPages } = JSON.parse(String(redisData));
        if (!mangaData.length)
            return res.status(404).json({ success: false });
        return res.status(200).json({
            success: true,
            data: mangaData,
            totalPages: totalPages,
            hasPrevPage: Number(page) > 1 ? true : false,
            hasNextPage: Number(page) < Number(totalPages) ? true : false,
        });
    });
    const getCompletedManga = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { page } = req.query;
        const key = `${nt_1.KEY_CACHE_COMPLETED_MANGA}${page !== undefined ? page : 1}`;
        const redisData = yield (0, cache_service_1.getCache)(key);
        if (!redisData) {
            console.log('cache miss');
            const { mangaData, totalPages } = yield Nt.getCompletedManga(Number(page));
            if (!mangaData.length) {
                return res.status(404).json({ success: false });
            }
            return res.status(200).json({
                success: true,
                data: mangaData,
                totalPages,
                hasPrevPage: Number(page) > 1 ? true : false,
                hasNextPage: Number(page) < Number(totalPages) ? true : false,
            });
        }
        console.log('cache hit');
        const { mangaData, totalPages } = JSON.parse(String(redisData));
        if (!mangaData.length)
            return res.status(404).json({ success: false });
        return res.status(200).json({
            success: true,
            data: mangaData,
            totalPages: totalPages,
            hasPrevPage: Number(page) > 1 ? true : false,
            hasNextPage: Number(page) < Number(totalPages) ? true : false,
        });
    });
    const getNewManga = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { page, genres } = req.query;
        const _genres = genres !== undefined ? `/${genres}` : '';
        const key = `${nt_1.KEY_CACHE_NEW_MANGA}${_genres}${-1}${15}${page !== undefined ? page : 1}`;
        const redisData = yield (0, cache_service_1.getCache)(key);
        if (!redisData) {
            const { mangaData, totalPages } = yield Nt.searchParams(-1, 15, String(genres), page);
            if (!mangaData.length)
                return res.status(404).json({ success: false });
            return res.status(200).json({
                success: true,
                data: mangaData,
                totalPages: totalPages,
                hasPrevPage: Number(page) > 1 ? true : false,
                hasNextPage: Number(page) < Number(totalPages) ? true : false,
            });
        }
        const { mangaData, totalPages } = JSON.parse(String(redisData));
        if (!mangaData.length)
            return res.status(404).json({ success: false });
        return res.status(200).json({
            success: true,
            data: mangaData,
            totalPages: totalPages,
            hasPrevPage: Number(page) > 1 ? true : false,
            hasNextPage: Number(page) < Number(totalPages) ? true : false,
        });
    });
    const getRanking = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { top, page, status, genres } = req.query;
        //nettruyen config: https://www.nettruyenco.com/tim-truyen?status=-1&sort=10
        const key = `${nt_1.KEY_CACHE_RANKING_MANGA}${page ? page : ''}${top ? nt_2.MANGA_SORT[top] : 10}${status ? nt_2.MANGA_STATUS[status] : -1}${genres ? genres : ''}`;
        const redisData = yield (0, cache_service_1.getCache)(key);
        if (!redisData) {
            const { mangaData, totalPages } = yield Nt.getRanking(top ? nt_2.MANGA_SORT[top] : 10, status ? nt_2.MANGA_STATUS[status] : -1, page ? page : undefined, genres ? genres : '');
            if (!mangaData.length) {
                return res.status(404).json({ success: false });
            }
            return res.status(200).json({
                success: true,
                data: mangaData,
                hasPrevPage: Number(page) > 1 ? true : false,
                hasNextPage: Number(page) < Number(totalPages) ? true : false,
            });
        }
        const { mangaData, totalPages } = JSON.parse(redisData);
        if (!mangaData.length) {
            return res.status(404).json({ success: false });
        }
        return res.status(200).json({
            success: true,
            data: mangaData,
            hasPrevPage: Number(page) > 1 ? true : false,
            hasNextPage: Number(page) < Number(totalPages) ? true : false,
        });
    });
    const search = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { q, limit } = req.query;
        let { page } = req.query;
        const { mangaData, totalPages } = yield Nt.searchQuery(String(q));
        if (!mangaData.length) {
            return res.status(404).json({ success: false });
        }
        let _mangaData = [...mangaData];
        let hasNextPage = false;
        if (limit) {
            if (!page)
                page = 1;
            _mangaData = _mangaData.slice((Number(page) - 1) * Number(limit), Number(limit) * Number(page));
            if (mangaData[Number(limit) * Number(page)]) {
                hasNextPage = true;
            }
        }
        res.status(200).json({
            success: true,
            data: _mangaData,
            totalPages,
            hasPrevPage: Number(page) > 1 ? true : false,
            hasNextPage,
        });
    });
    const getManga = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { mangaSlug } = req.params;
        const { title, updatedAt, thumbnail, otherName, author, status, genres, view, review, chapterList, } = yield Nt.getMangaDetail(String(mangaSlug));
        // if (!title.length) return res.status(404).json({ sucess: false });
        res.status(200).json({
            success: true,
            data: {
                title,
                updatedAt,
                otherName,
                thumbnail,
                author,
                status,
                genres,
                view,
                review,
                chapterList,
            },
        });
    });
    const getChapter = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { mangaSlug, chapter, chapterId } = req.params;
        const chapterSrc = yield Nt.getChapterSrc(String(mangaSlug), Number(chapter), String(chapterId));
        if (!chapterSrc)
            return res.status(404).json({ success: false });
        res.json({
            success: true,
            data: chapterSrc,
        });
    });
    const getMangaAuthor = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { name } = req.query;
        const { mangaData, totalPages } = yield Nt.getMangaAuthor(name.trim());
        if (!mangaData.length) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({
            success: true,
            data: mangaData,
            totalPages,
        });
    });
    return {
        getCompletedManga,
        getNewManga,
        getMangaAuthor,
        search,
        getManga,
        getChapter,
        getRanking,
        filtersManga,
        getNewUpdatedManga,
        advancedSearch,
    };
}
exports.default = ntController;
