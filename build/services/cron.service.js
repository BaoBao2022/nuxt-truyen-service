"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_cron_1 = tslib_1.__importDefault(require("node-cron"));
const Nt_model_1 = tslib_1.__importDefault(require("../models/Nt.model"));
const baseUrl = process.env.NT_SOURCE_URL;
const Nt = Nt_model_1.default.Instance(baseUrl);
const tasks = [];
function cachingNewManga() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //cache page 1,2,3
        yield Nt.searchParams(-1, 15, 'undefined', 1);
        yield Nt.searchParams(-1, 15, 'undefined', 2);
        yield Nt.searchParams(-1, 15, 'undefined', 3);
    });
}
function cachingCompletedManga() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //cache page 1,2,3
        yield Nt.getCompletedManga(1);
        yield Nt.getCompletedManga(2);
        yield Nt.getCompletedManga(3);
    });
}
function cachingRankingManga() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //default: https://www.nettruyenco.com/tim-truyen?status=-1&sort=10&page=1
        //cache page 1
        //genres: manhua
        //sort: all, month, week, day
        //page = this page
        yield Nt.getRanking(10, -1, 1, 'manhua');
        yield Nt.getRanking(11, -1, 1, 'manhua');
        yield Nt.getRanking(12, -1, 1, 'manhua');
        yield Nt.getRanking(13, -1, 1, 'manhua');
    });
}
function cachingNewUpdatedManga() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //cache page 1,2,3
        //default: https://www.nettruyenco.com/tim-truyen?status=-1&sort=10&page=1
        //genres: all, sort: all, page = this page
        yield Nt.getNewUpdatedManga(1);
        yield Nt.getNewUpdatedManga(2);
        yield Nt.getNewUpdatedManga(3);
    });
}
tasks.push(node_cron_1.default.schedule('*/5 * * * *', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('caching new UPDATED manga every 5 minutes');
    yield cachingNewUpdatedManga();
})));
tasks.push(node_cron_1.default.schedule('*/5 * * * *', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('caching new manga every 5 minutes');
    yield cachingNewManga();
})));
tasks.push(node_cron_1.default.schedule('0 * * * *', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('caching completed manga every 1 hour');
    yield cachingCompletedManga();
})));
tasks.push(node_cron_1.default.schedule('* */12 * * *', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('caching ranking manga every 12 hours');
    yield cachingRankingManga();
})));
exports.default = tasks;
