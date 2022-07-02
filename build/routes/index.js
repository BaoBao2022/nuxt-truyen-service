"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tmzz_routes_1 = tslib_1.__importDefault(require("./tmzz.routes"));
const nt_routes_1 = tslib_1.__importDefault(require("./nt.routes"));
const proxy_controller_1 = tslib_1.__importDefault(require("../controllers/proxy.controller"));
function route(app) {
    const src_1 = 'nt';
    const src_2 = 'lh';
    const src_3 = 'tmzz';
    app.use(`/api/${src_1}`, nt_routes_1.default);
    app.use(`/api/${src_3}`, tmzz_routes_1.default);
    app.use('/api/proxy', (0, proxy_controller_1.default)().corsAnywhere);
}
exports.default = route;
