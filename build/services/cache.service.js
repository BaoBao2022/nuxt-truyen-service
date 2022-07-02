"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.cache = void 0;
const tslib_1 = require("tslib");
const config_1 = require("../config");
const Redis_1 = tslib_1.__importDefault(require("../libs/Redis"));
const cachingClient = Redis_1.default.Instance(config_1.redisPort, config_1.redisHost, config_1.redisUsername, config_1.redisPassword).getRedisClient();
function cache(key, value, page, expiredTime = 60) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //just always storage page 1,2,3. Other pages just caching
        if (page === 1 || page === 2 || page === 3) {
            yield (cachingClient === null || cachingClient === void 0 ? void 0 : cachingClient.set(key, value));
        }
        else {
            yield (cachingClient === null || cachingClient === void 0 ? void 0 : cachingClient.setEx(key, expiredTime, value));
        }
    });
}
exports.cache = cache;
function getCache(key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return cachingClient.get(key);
    });
}
exports.getCache = getCache;
