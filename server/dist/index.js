"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var home_1 = __importDefault(require("./router/home"));
var client_1 = require("@prisma/client");
dotenv_1.default.config({ path: "./.env" });
exports.prisma = new client_1.PrismaClient();
var app = (0, express_1.default)();
var PORT = process.env.PORT;
if (!PORT) {
    console.error("Environment variables and PORT must be provided.");
    process.exit(1);
}
var corsOptions = {
    origin: function (origin, callback) {
        var _a;
        var allowedOrigins = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.options("", (0, cors_1.default)());
app.use("/", home_1.default);
app.use(function (req, res, next) {
    next();
});
app.use(function (err, req, res, next) {
    console.error('Serverless Function:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
});
exports.prisma.$connect()
    .then(function () {
    console.log('Connected to the database');
    app.listen(PORT, function () {
        console.log("Server is running on http://localhost:".concat(PORT));
    });
})
    .catch(function (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
});
exports.default = app;
