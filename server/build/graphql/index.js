"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const query_1 = require("./query");
exports.typeDefs = `
    ${query_1.Query.typeDefs}
    
    type Query {
        ${query_1.Query.queries}
    }
`;
exports.resolvers = {
    Query: Object.assign({}, query_1.Query.resolvers.queries),
};
