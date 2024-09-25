import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import home from './router/home';
import { PrismaClient } from '@prisma/client';
import PaymentRouter from './router/payment';
import AuthRouter from './router/auth';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './graphql';

dotenv.config({ path: "./.env" });
import './cronJobs';

export const prisma = new PrismaClient();

const app = express();
const PORT: string | undefined = process.env.PORT;

if (!PORT) {
    console.error("Environment variables and PORT must be provided.");
    process.exit(1);
}

const corsOptions = {
    origin: (origin: any, callback: any) => {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.options("", cors());

const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,

    introspection: process.env.NODE_ENV !== 'production',
});

graphqlServer.start().then(() => {
    app.use("/graphql", expressMiddleware(graphqlServer,
        {
            context: async ({ req, res }) => ({ req, res }),
        }

    ));
});

app.use("/", home);
app.use('/api/payment', PaymentRouter);
app.use('/api/auth', AuthRouter);

app.use((req, res, next) => {
    next();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Serverless Function:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
});

prisma.$connect()
    .then(() => {
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error: any) => {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    });

export default app;
