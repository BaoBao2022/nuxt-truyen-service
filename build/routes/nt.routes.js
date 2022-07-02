"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_promise_router_1 = tslib_1.__importDefault(require("express-promise-router"));
const nt_controller_1 = tslib_1.__importDefault(require("../controllers/nt.controller"));
const router = (0, express_promise_router_1.default)();
/*
/nt/search
*/
router.route('/search').get((0, nt_controller_1.default)().search);
/*
/nt/search
*/
router.route('/advanced-search').get((0, nt_controller_1.default)().advancedSearch);
/*
/nt/author
*/
router.route('/author').get((0, nt_controller_1.default)().getMangaAuthor);
/*
/nt/filters
*/
router.route('/filters').get((0, nt_controller_1.default)().filtersManga);
/*
/nt/ranking
*/
router.route('/ranking').get((0, nt_controller_1.default)().getRanking);
/*
/nt/manga
*/
router.route('/manga/:mangaSlug').get((0, nt_controller_1.default)().getManga);
/*
/nt/chapter
*/
router
    .route('/chapter/:mangaSlug/:chapter/:chapterId')
    .get((0, nt_controller_1.default)().getChapter);
/*
/nt/new
*/
router.route('/new').get((0, nt_controller_1.default)().getNewManga);
/*
/nt/new-updated
*/
router.route('/new-updated').get((0, nt_controller_1.default)().getNewUpdatedManga);
/*
/nt/completed
*/
router.route('/completed').get((0, nt_controller_1.default)().getCompletedManga);
/*
this route just test!
/nt/test
*/
// router.route('/test').get(ntController().testRoute);
exports.default = router;
