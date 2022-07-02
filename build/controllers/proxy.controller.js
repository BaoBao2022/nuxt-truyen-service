"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = tslib_1.__importDefault(require("axios"));
function proxyController() {
    const corsAnywhere = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { src, url } = req.query;
        const options = {
            responseType: 'stream',
            headers: {
                referer: String(url),
            },
        };
        const response = yield axios_1.default.get(String(src), options);
        return response.data.pipe(res);
    });
    return { corsAnywhere };
}
exports.default = proxyController;
