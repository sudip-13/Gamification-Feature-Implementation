"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const typedefs_1 = require("./typedefs");
const resolvers_1 = require("./resolvers");
const queries_1 = require("./queries");
exports.Query = { queries: queries_1.queries, typeDefs: typedefs_1.typeDefs, resolvers: resolvers_1.resolvers };
