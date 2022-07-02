"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_promise_router_1 = tslib_1.__importDefault(require("express-promise-router"));
const tmzz_controller_1 = tslib_1.__importDefault(require("../controllers/tmzz.controller"));
const router = (0, express_promise_router_1.default)();
/*
/tmzz/new
*/
router.route('/new').get((0, tmzz_controller_1.default)().getNewManga);
/*
/tmzz/new-update
*/
router.route('/new-update').get((0, tmzz_controller_1.default)().getNewMangaUpdated);
exports.default = router;
