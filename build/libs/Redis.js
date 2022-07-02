"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const redis_1 = require("redis");
class Redis {
    constructor(port, host, username, password) {
        this.port = port;
        this.host = host;
        this.username = username;
        this.password = password;
        this.client = (0, redis_1.createClient)({
            url: `redis://${this.username}:${this.password}@${this.host}:${this.port}`,
        });
        this.connect();
        this.client.on('error', (err) => console.log('Redis Client Error >>>>', err));
    }
    connect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
            }
            catch (err) {
                console.log('Connect Error >>>> ', err);
            }
        });
    }
    static Instance(port, host, username, password) {
        if (!this.instance) {
            this.instance = new this(port, host, username, password);
        }
        return this.instance;
    }
    getRedisClient() {
        return this.client;
    }
}
exports.default = Redis;
