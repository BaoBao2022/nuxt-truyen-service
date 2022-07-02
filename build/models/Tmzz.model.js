"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Scraper_1 = tslib_1.__importDefault(require("../libs/Scraper"));
const node_html_parser_1 = require("node-html-parser");
class TmzzModel extends Scraper_1.default {
    constructor(baseUrl, axiosConfig, timeout) {
        super(baseUrl, axiosConfig, timeout);
    }
    static Instance(baseUrl, axiosConfig, timeout) {
        if (!this.instance) {
            this.instance = new this(baseUrl, axiosConfig, timeout);
        }
        return this.instance;
    }
    getNewManga(Section) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.client.get(this.baseUrl);
            const document = (0, node_html_parser_1.parse)(data);
            const mangaList = document.querySelectorAll('.manga-list');
            const newMangaDOM = mangaList[Section].querySelectorAll('li');
            const newMangaData = [...newMangaDOM].map((manga) => {
                var _a, _b, _c, _d, _e, _f;
                const newChapter = (_a = manga.querySelector('strong')) === null || _a === void 0 ? void 0 : _a.innerHTML;
                const thumbnail = (_b = manga.querySelector('img')) === null || _b === void 0 ? void 0 : _b.getAttribute('src');
                const view = (_c = manga.querySelector('.view-count span')) === null || _c === void 0 ? void 0 : _c.innerHTML;
                const name = String((_d = manga.querySelector('h4')) === null || _d === void 0 ? void 0 : _d.innerHTML).replace(/(\r\n|\n|\r)/gm, '');
                const updatedAt = (_e = manga.querySelector('.manga-meta span')) === null || _e === void 0 ? void 0 : _e.innerHTML;
                const path = String((_f = manga.querySelector('a')) === null || _f === void 0 ? void 0 : _f.getAttribute('href'));
                const slug = path.substring(path.lastIndexOf('/') + 1);
                return { newChapter, thumbnail, view, name, updatedAt, slug };
            });
            return newMangaData;
        });
    }
}
exports.default = TmzzModel;
