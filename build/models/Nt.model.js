"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_html_parser_1 = require("node-html-parser");
const nt_1 = require("../constants/nt");
const Scraper_1 = tslib_1.__importDefault(require("../libs/Scraper"));
const cache_service_1 = require("../services/cache.service");
const genres_1 = require("../types/genres");
const stringHandler_1 = require("../utils/stringHandler");
class NtModel extends Scraper_1.default {
    constructor(baseUrl, axiosConfig, timeout) {
        super(baseUrl, axiosConfig, timeout);
    }
    static Instance(baseUrl, axiosConfig, timeout) {
        if (!this.instance) {
            this.instance = new this(baseUrl, axiosConfig, timeout);
        }
        return this.instance;
    }
    parseSource(document) {
        var _a;
        const mangaList = document.querySelectorAll('.item');
        const mangaData = [...mangaList].map((manga) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const thumbnail = this.unshiftProtocol(String((_a = manga.querySelector('img')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-original')) || String((_b = manga.querySelector('img')) === null || _b === void 0 ? void 0 : _b.getAttribute('src')));
            const newChapter = (_c = manga.querySelector('ul > li > a')) === null || _c === void 0 ? void 0 : _c.innerHTML;
            const updatedAt = (_d = manga.querySelector('ul > li > i')) === null || _d === void 0 ? void 0 : _d.innerHTML;
            const view = (_e = manga.querySelector('pull-left > i')) === null || _e === void 0 ? void 0 : _e.innerHTML;
            const name = (0, stringHandler_1.normalizeString)(String((_f = manga.querySelector('h3 a')) === null || _f === void 0 ? void 0 : _f.innerHTML));
            const tooltip = manga.querySelectorAll('.box_li .message_main p');
            let status = '';
            let author = '';
            let genres = [''];
            let otherName = '';
            tooltip.forEach((item) => {
                var _a;
                const title = (_a = item.querySelector('label')) === null || _a === void 0 ? void 0 : _a.textContent;
                const str = (0, stringHandler_1.normalizeString)(String(item.textContent).substring(String(item.textContent).lastIndexOf(':') + 1));
                switch (title) {
                    case 'Thể loại:':
                        genres = str.split(', ');
                        break;
                    case 'Tác giả:':
                        author = str;
                        break;
                    case 'Tình trạng:':
                        status = str;
                        break;
                    case 'Tên khác:':
                        otherName = str;
                        break;
                }
            });
            const review = (0, stringHandler_1.normalizeString)(String((_g = manga.querySelector('.box_li .box_text')) === null || _g === void 0 ? void 0 : _g.textContent));
            const path = String((_h = manga.querySelector('h3 a')) === null || _h === void 0 ? void 0 : _h.getAttribute('href'));
            const slug = path.substring(path.lastIndexOf('/') + 1);
            return {
                status,
                author,
                genres,
                otherName,
                review,
                newChapter,
                thumbnail,
                view,
                name,
                updatedAt,
                slug,
            };
        });
        const totalPagesPath = String((_a = document.querySelector('.pagination > li')) === null || _a === void 0 ? void 0 : _a.innerHTML).trim();
        const totalPages = Number(totalPagesPath
            .substring(totalPagesPath.lastIndexOf('/') + 1)
            .trim()) || 1;
        return { mangaData, totalPages };
    }
    unshiftProtocol(urlSrc) {
        const protocols = ['http', 'https'];
        return protocols.some((protocol) => urlSrc.includes(protocol))
            ? urlSrc
            : `https:${urlSrc}`;
    }
    getMangaAuthor(author) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/tim-truyen`, {
                    params: { 'tac-gia': author },
                });
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                return this.parseSource(document);
            }
            catch (err) {
                console.log(err);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    searchParams(status, sort, genres, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _genres = genres !== 'undefined' ? `/${genres}` : '';
            const queryParams = {
                status,
                sort,
                page,
            };
            const key = `${nt_1.KEY_CACHE_NEW_MANGA}${_genres}${status}${sort}${page}`;
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/tim-truyen${_genres}`, { params: queryParams });
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                const { mangaData, totalPages } = this.parseSource(document);
                yield (0, cache_service_1.cache)(key, JSON.stringify({ mangaData, totalPages }), page, nt_1.DEFAULT_EXPIRED_NEWMANGA_TIME);
                return { mangaData, totalPages };
            }
            catch (err) {
                console.log(err);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    advancedSearch(genres, minchapter, top, page, status, gender) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = `${nt_1.KEY_CACHE_ADVANCED_MANGA}${genres}${minchapter}${top}${page}${status}${gender}`;
            // console.log(
            //     `genres: ${genres}, minchapter: ${minchapter}, top: ${top}, page: ${page}, status: ${status}, gender: ${gender}`,
            // );
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/tim-truyen-nang-cao`, {
                    params: {
                        genres,
                        gender,
                        minchapter,
                        sort: top,
                        page,
                        status,
                    },
                });
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                const { mangaData, totalPages } = this.parseSource(document);
                // console.log(':: ', document.querySelector('ModuleContent'));
                yield (0, cache_service_1.cache)(key, JSON.stringify({ mangaData, totalPages }), page, nt_1.DEFAULT_EXPIRED_ADVANCED_SEARCH_MANGA);
                return { mangaData, totalPages };
            }
            catch (err) {
                console.log(err);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    getNewUpdatedManga(page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const queryParams = {
                page,
            };
            const key = `${nt_1.KEY_CACHE_NEW_UPDATED_MANGA}${page}`;
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/tim-truyen`, {
                    params: queryParams,
                });
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                const { mangaData, totalPages } = this.parseSource(document);
                yield (0, cache_service_1.cache)(key, JSON.stringify({ mangaData, totalPages }), page, nt_1.DEFAULT_EXPIRED_NEW_UPDATED_MANGA_TIME);
                return { mangaData, totalPages };
            }
            catch (error) {
                console.log(error);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    filtersManga(genres, page, sort, status) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _genres = genres !== null ? `/${genres}` : '';
            const queryParams = {};
            /*
            if all are null, default status: 'all', sort: 'new'
            see: https://www.nettruyenco.com/tim-truyen
            */
            if (sort)
                queryParams.sort = sort;
            if (status)
                queryParams.status = status;
            if (page)
                queryParams.page = page;
            let key = '';
            if (genres === 'manhua' && sort) {
                key = `${nt_1.KEY_CACHE_FILTERS_MANGA}${page !== undefined ? page : 1}${genres}${sort}`;
            }
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/tim-truyen${_genres}`, { params: queryParams });
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                const { mangaData, totalPages } = this.parseSource(document);
                yield (0, cache_service_1.cache)(key, JSON.stringify({ mangaData, totalPages }), page ? page : 1, nt_1.DEFAULT_EXPIRED_NEW_UPDATED_MANGA_TIME);
                return { mangaData, totalPages };
            }
            catch (error) {
                console.log(error);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    searchQuery(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const baseUrlSearch = `/Comic/Services/SuggestSearch.ashx`;
            try {
                const { data } = yield this.client.get(`${this.baseUrl}${baseUrlSearch}`, { params: { q: query } });
                const document = (0, node_html_parser_1.parse)(data);
                const protocols = ['http', 'https'];
                const searchResultList = document.querySelectorAll('li');
                const mangaData = [...searchResultList].map((manga) => {
                    var _a, _b, _c;
                    const iTagList = manga.querySelectorAll('h4 i');
                    const newChapter = iTagList[0].innerHTML;
                    const genres = genres_1.GENRES.filter((genre) => {
                        let flag = false;
                        iTagList.forEach((tag) => {
                            const str = String(tag.innerHTML);
                            if ((0, stringHandler_1.isExactMatch)(str, genre)) {
                                flag = true;
                                return;
                            }
                        });
                        if (flag)
                            return genre;
                    });
                    // const thumbnail = manga
                    //     .querySelector('img')
                    //     ?.getAttribute('src');
                    const rawThumbnail = (_a = manga
                        .querySelector('img')) === null || _a === void 0 ? void 0 : _a.getAttribute('src');
                    const thumbnail = protocols.some((protocol) => String(rawThumbnail).includes(protocol))
                        ? String(rawThumbnail)
                        : `https:${String(rawThumbnail)}`;
                    const name = (_b = manga.querySelector('h3')) === null || _b === void 0 ? void 0 : _b.innerHTML;
                    const path = String((_c = manga.querySelector('a')) === null || _c === void 0 ? void 0 : _c.getAttribute('href')).trim();
                    const slug = path.substring(path.lastIndexOf('/') + 1);
                    return { thumbnail, name, slug, newChapter, genres };
                });
                const totalPages = mangaData.length;
                return { mangaData, totalPages };
            }
            catch (err) {
                console.log(err);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    getCompletedManga(page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = `${nt_1.KEY_CACHE_COMPLETED_MANGA}${page}`;
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/truyen-full`, {
                    params: { page: page },
                });
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                const { mangaData, totalPages } = this.parseSource(document);
                yield (0, cache_service_1.cache)(key, JSON.stringify({ mangaData, totalPages }), page, nt_1.DEFAULT_EXPIRED_COMPLETED_MANGA_TIME);
                return { mangaData, totalPages };
            }
            catch (error) {
                console.log('::: ', error);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    getRanking(top, status = -1, page, genres) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const queryParams = {
                status: status,
                sort: top,
                page: page,
            };
            const key = `${nt_1.KEY_CACHE_RANKING_MANGA}${page ? page : ''}${top}${status}${genres}`;
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/tim-truyen${genres && `/${genres}`}`, {
                    params: queryParams,
                });
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                const { mangaData, totalPages } = this.parseSource(document);
                (0, cache_service_1.cache)(key, JSON.stringify({ mangaData, totalPages }), page !== undefined ? page : 1, nt_1.DEFAULT_EXPIRED_RANKING_MANGA_TIME);
                return { mangaData, totalPages };
            }
            catch (err) {
                console.log(err);
                return { mangaData: [], totalPages: 0 };
            }
        });
    }
    getMangaDetail(mangaSlug) {
        var _a, _b, _c, _d, _e;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const baseUrlMangaDetail = 'truyen-tranh';
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/${baseUrlMangaDetail}/${mangaSlug}`);
                const document = (0, node_html_parser_1.parse)(data);
                const rootSelector = '#item-detail';
                const title = (0, stringHandler_1.normalizeString)(String((_a = document.querySelector(`${rootSelector} h1`)) === null || _a === void 0 ? void 0 : _a.textContent));
                const updatedAt = (0, stringHandler_1.normalizeString)(String((_b = document.querySelector(`${rootSelector} time`)) === null || _b === void 0 ? void 0 : _b.textContent));
                const otherName = (0, stringHandler_1.normalizeString)(String((_c = document.querySelector(`${rootSelector} .detail-info .other-name`)) === null || _c === void 0 ? void 0 : _c.textContent));
                const author = (0, stringHandler_1.normalizeString)(String(document.querySelectorAll(`${rootSelector} .detail-info .author p`)[1].textContent));
                const status = (0, stringHandler_1.normalizeString)(String(document.querySelectorAll(`${rootSelector} .detail-info .status p`)[1].textContent));
                const genresArrayRaw = document
                    .querySelectorAll(`${rootSelector} .kind p`)[1]
                    .querySelectorAll('a');
                const genres = [...genresArrayRaw].map((genre) => {
                    const genreTitle = (0, stringHandler_1.normalizeString)(String(genre.textContent));
                    const hrefString = String(genre.getAttribute('href'));
                    const slug = hrefString.substring(hrefString.lastIndexOf('/') + 1);
                    return { genreTitle, slug };
                });
                const lastChildUl = document.querySelectorAll(`${rootSelector} .detail-info .list-info .row`);
                const view = (0, stringHandler_1.normalizeString)(String(lastChildUl[lastChildUl.length - 1].querySelectorAll('p')[1]
                    .textContent));
                const review = (0, stringHandler_1.normalizeString)(String((_d = document.querySelector(`${rootSelector} .detail-content p`)) === null || _d === void 0 ? void 0 : _d.textContent));
                const chapterListRaw = document.querySelectorAll(`${rootSelector} #nt_listchapter ul .row`);
                const chapterList = [...chapterListRaw].map((chapter) => {
                    var _a, _b, _c;
                    const chapterTitle = (0, stringHandler_1.normalizeString)(String((_a = chapter.querySelector('a')) === null || _a === void 0 ? void 0 : _a.textContent));
                    const chapterId = (_b = chapter
                        .querySelector('a')) === null || _b === void 0 ? void 0 : _b.getAttribute('data-id');
                    const arr = String((_c = chapter.querySelector('a')) === null || _c === void 0 ? void 0 : _c.getAttribute('href')).split('/');
                    const chapterStr = arr[arr.length - 2];
                    const chapterNumber = chapterStr.slice(chapterStr.indexOf('-') + 1);
                    const updatedAt = (0, stringHandler_1.normalizeString)(String(chapter.querySelectorAll('div')[1].textContent));
                    const view = (0, stringHandler_1.normalizeString)(String(chapter.querySelectorAll('div')[2].textContent));
                    return {
                        chapterId,
                        chapterNumber,
                        chapterTitle,
                        updatedAt,
                        view,
                    };
                });
                const thumbnail = this.unshiftProtocol(String((_e = document
                    .querySelector(`${rootSelector} .col-image img`)) === null || _e === void 0 ? void 0 : _e.getAttribute('src')));
                return {
                    title,
                    updatedAt,
                    thumbnail,
                    otherName,
                    author,
                    status,
                    genres,
                    view,
                    review,
                    chapterList,
                };
            }
            catch (error) {
                // console.log(error);
                return {
                    title: '',
                    updatedAt: '',
                    otherName: '',
                    author: '',
                    status: '',
                    genres: '',
                    view: '',
                    review: '',
                    chapterList: '',
                };
            }
        });
    }
    getChapterSrc(mangaSlug, chapter, chapterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.client.get(`${this.baseUrl}/truyen-tranh/${mangaSlug}/chap-${chapter}/${chapterId}`);
                const document = (0, node_html_parser_1.parse)(data);
                //@ts-ignore
                const protocols = ['http', 'https'];
                const pagesRaw = document.querySelectorAll('.reading-detail .page-chapter');
                const pages = [...pagesRaw].map((page) => {
                    var _a, _b, _c;
                    const id = (_a = page
                        .querySelector('img')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-index');
                    const source = (_b = page
                        .querySelector('img')) === null || _b === void 0 ? void 0 : _b.getAttribute('data-original');
                    const srcCDN = (_c = page
                        .querySelector('img')) === null || _c === void 0 ? void 0 : _c.getAttribute('data-cdn');
                    const imgSrc = protocols.some((protocol) => source === null || source === void 0 ? void 0 : source.includes(protocol))
                        ? source
                        : `https:${source}`;
                    const imgSrcCDN = protocols.some((protocol) => srcCDN === null || srcCDN === void 0 ? void 0 : srcCDN.includes(protocol))
                        ? srcCDN
                        : `https:${srcCDN}`;
                    return { id, imgSrc, imgSrcCDN };
                });
                return pages;
            }
            catch (err) {
                console.log(err);
                return null;
            }
        });
    }
}
exports.default = NtModel;
