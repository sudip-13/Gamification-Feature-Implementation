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
exports.resolvers = void 0;
const authmiddleware_1 = __importDefault(require("../../middleware/authmiddleware"));
const index_1 = require("../../index");
const applyMiddlewareToResolver = (middleware, resolver) => {
    return (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { req, res } = context;
        return new Promise((resolve, reject) => {
            middleware(req, res, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve(resolver(parent, args, context, info));
            });
        });
    });
};
const queries = {
    Index: () => {
        return [{ "msg": "Hello world!" }];
    },
    getUserData: applyMiddlewareToResolver(authmiddleware_1.default, (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { req } = context;
        const userId = req.userId;
        console.log('User ID:', userId);
        try {
            const userDetails = yield index_1.prisma.user.findUnique({ where: { userId: userId } });
            if (!userDetails) {
                throw new Error('User not found');
            }
            return [{
                    redeemablePoints: userDetails === null || userDetails === void 0 ? void 0 : userDetails.canRedemPoints,
                    noOfTransaction: userDetails === null || userDetails === void 0 ? void 0 : userDetails.noOfTransactions,
                    cash: userDetails === null || userDetails === void 0 ? void 0 : userDetails.redeemedPointsConvertedToCash,
                }];
        }
        catch (error) {
            console.log(error);
            throw new Error('Error fetching user data');
        }
    })),
    getTransactionHistory: applyMiddlewareToResolver(authmiddleware_1.default, (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { req } = context;
        const userId = req.userId;
        console.log('User ID:', userId);
        try {
            const transactionHistory = yield index_1.prisma.history.findMany({ where: { userId: userId } });
            if (transactionHistory.length === 0) {
                return [];
            }
            return transactionHistory.map((transaction) => ({
                transactionId: transaction.transactionsId,
                status: transaction.transactionType,
                transactionAmount: transaction.transactionAmount,
                timestamp: transaction.timestamp.toISOString(),
            }));
        }
        catch (error) {
            console.error(error);
            throw new Error('Error fetching transaction history');
        }
    })),
    getWithdrawalHistory: applyMiddlewareToResolver(authmiddleware_1.default, (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { req } = context;
        const userId = req.userId;
        console.log('User ID:', userId);
        try {
            const withdrawalRequests = yield index_1.prisma.withdrawalRequests.findMany({ where: { userId: userId } });
            if (withdrawalRequests.length === 0) {
                return [];
            }
            return withdrawalRequests.map((withdrawalRequest) => ({
                accountNumber: withdrawalRequest.accountNumber,
                transactionId: withdrawalRequest.transactionsId,
                status: withdrawalRequest.status,
                amount: withdrawalRequest.amount,
                timestamp: withdrawalRequest.timestamp.toISOString(),
            }));
        }
        catch (error) {
            console.error(error);
            throw new Error('Error fetching withdrawal requests');
        }
    })),
    getWithdrawalDetails: applyMiddlewareToResolver(authmiddleware_1.default, (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { req } = context;
        const userId = req.userId;
        console.log('User ID:', userId);
        try {
            const withdrawalDetails = yield index_1.prisma.withdrawalDetails.findMany({
                where: { userId: userId }
            });
            if (withdrawalDetails.length === 0) {
                throw new Error('Withdrawal details not found');
            }
            return withdrawalDetails.map((withdrawalDetail) => ({
                bankName: withdrawalDetail.bankName,
                accountNumber: withdrawalDetail.accountNumber,
                ifscCode: withdrawalDetail.ifscCode,
            }));
        }
        catch (error) {
            console.error(error);
            throw new Error('Error fetching withdrawal details');
        }
    }))
};
exports.resolvers = { queries };
