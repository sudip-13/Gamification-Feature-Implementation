import { Query } from './query';

export const typeDefs = `
    ${Query.typeDefs}
    
    type Query {
        ${Query.queries}
    }
`;

export const resolvers = {
    Query: {
        ...Query.resolvers.queries,
    },
};
