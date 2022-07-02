"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MANGA_SORT = exports.MANGA_STATUS = void 0;
//nettruyen config: https://www.nettruyenco.com/tim-truyen?status=-1&sort=10
var MANGA_STATUS;
(function (MANGA_STATUS) {
    MANGA_STATUS[MANGA_STATUS["all"] = -1] = "all";
    MANGA_STATUS[MANGA_STATUS["ongoing"] = 1] = "ongoing";
    MANGA_STATUS[MANGA_STATUS["completed"] = 2] = "completed";
})(MANGA_STATUS = exports.MANGA_STATUS || (exports.MANGA_STATUS = {}));
//nettruyen config: https://www.nettruyenco.com/tim-truyen?status=-1&sort=10
var MANGA_SORT;
(function (MANGA_SORT) {
    MANGA_SORT[MANGA_SORT["newComic"] = 0] = "newComic";
    MANGA_SORT[MANGA_SORT["all"] = 10] = "all";
    MANGA_SORT[MANGA_SORT["month"] = 11] = "month";
    MANGA_SORT[MANGA_SORT["week"] = 12] = "week";
    MANGA_SORT[MANGA_SORT["day"] = 13] = "day";
    MANGA_SORT[MANGA_SORT["new"] = 15] = "new";
    MANGA_SORT[MANGA_SORT["chapter"] = 30] = "chapter";
})(MANGA_SORT = exports.MANGA_SORT || (exports.MANGA_SORT = {}));
