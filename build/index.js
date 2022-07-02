"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cors_1 = tslib_1.__importDefault(require("cors"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const express_1 = tslib_1.__importDefault(require("express"));
const http_errors_1 = tslib_1.__importDefault(require("http-errors"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const routes_1 = tslib_1.__importDefault(require("./routes"));
const cron_service_1 = tslib_1.__importDefault(require("./services/cron.service"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
//apply middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
//router
(0, routes_1.default)(app);
app.get('/', (req, res) => {
    res.status(200).json({ success: true });
});
//catch 404
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, '404 Not Found!'));
});
//error handler
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;
    console.log(`${req.url} --- ${req.method} --- ${JSON.stringify({
        message: error.message,
    })}`);
    return res.status(status).json({
        status,
        message: error.message,
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${port}`);
});
cron_service_1.default.forEach((task) => task.start());
