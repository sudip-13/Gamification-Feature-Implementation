"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const home_1 = __importDefault(require("./router/home"));
const client_1 = require("@prisma/client");
const payment_1 = __importDefault(require("./router/payment"));
const auth_1 = __importDefault(require("./router/auth"));
const express4_1 = require("@apollo/server/express4");
const server_1 = require("@apollo/server");
const graphql_1 = require("./graphql");
dotenv_1.default.config({ path: "./.env" });
require("./cronJobs");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
if (!PORT) {
    console.error("Environment variables and PORT must be provided.");
    process.exit(1);
}
const corsOptions = {
    origin: (origin, callback) => {
        var _a;
        const allowedOrigins = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000'];
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
const graphqlServer = new server_1.ApolloServer({
    typeDefs: graphql_1.typeDefs,
    resolvers: graphql_1.resolvers,
    introspection: process.env.NODE_ENV !== 'production',
});
graphqlServer.start().then(() => {
    app.use("/graphql", (0, express4_1.expressMiddleware)(graphqlServer, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) { return ({ req, res }); }),
    }));
});
app.use("/", home_1.default);
app.use('/api/payment', payment_1.default);
app.use('/api/auth', auth_1.default);
app.use((req, res, next) => {
    next();
});
app.use((err, req, res, next) => {
    console.error('Serverless Function:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
});
exports.prisma.$connect()
    .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
});
exports.default = app;
