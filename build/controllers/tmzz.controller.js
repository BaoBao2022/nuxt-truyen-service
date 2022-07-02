"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const Tmzz_model_1 = tslib_1.__importDefault(require("../models/Tmzz.model"));
const tmzz_1 = require("../types/tmzz");
const baseUrl = process.env.TMZZ_SOURCE_URL;
const Tmzz = Tmzz_model_1.default.Instance(baseUrl);
function tmzzController() {
    const getNewManga = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const manga = yield Tmzz.getNewManga(tmzz_1.MangaTmzzSection.NewManga);
        res.status(200).json({ data: manga });
    });
    const getNewMangaUpdated = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const manga = yield Tmzz.getNewManga(tmzz_1.MangaTmzzSection.NewMangaUpdated);
        return res.status(200).json({ data: manga });
    });
    return { getNewManga, getNewMangaUpdated };
}
exports.default = tmzzController;
