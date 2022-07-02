"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class Scraper {
    constructor(baseUrl, axiosConfig, timeout) {
        const config = Object.assign({ header: {
                referer: baseUrl,
                origin: baseUrl,
            }, timeout: timeout || 10000 }, axiosConfig);
        this.baseUrl = baseUrl;
        this.client = axios_1.default.create(config);
    }
}
exports.default = Scraper;
