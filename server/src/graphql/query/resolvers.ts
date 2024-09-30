import { authMiddlewareGql } from '../../middleware/authmiddleware';
import { prisma } from '../../index';

const applyMiddlewareToResolver = (middleware: Function, resolver: Function) => {
    return async (parent: any, args: any, context: any, info: any) => {
        const { req, res } = context;
        return new Promise((resolve, reject) => {
            middleware(req, res, (error: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(resolver(parent, args, context, info));
            });
        });
    };
};

const queries = {


    Index: () => {
        return [{ "msg": "Hello world!" }];
    },


    getUserData: applyMiddlewareToResolver(authMiddlewareGql, async (parent: any, args: any, context: any) => {
        const { req } = context;
        const userId = req.userId;

        if (!userId) {
            throw new Error('Unauthorized: No valid user ID');
        }

        try {
            const userDetails = await prisma.user.findUnique({ where: { userId: userId } });
            if (!userDetails) {
                throw new Error('User not found');
            }
            return [{
                redeemablePoints: userDetails?.canRedemPoints,
                noOfTransaction: userDetails?.noOfTransactions,
                cash: userDetails?.redeemedPointsConvertedToCash,
            }];
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching user data');
        }
    }),


    getTransactionHistory: applyMiddlewareToResolver(authMiddlewareGql, async (parent: any, args: any, context: any) => {
        const { req } = context;
        const userId = req.userId;

        if (!userId) {
            throw new Error('Unauthorized: No valid user ID');
        }

        try {
            const transactionHistory = await prisma.history.findMany({ where: { userId: userId },orderBy: { timestamp: 'desc' } });
            if (transactionHistory.length === 0) {
                return [];
            }

            return transactionHistory.map((transaction) => ({
                transactionId: transaction.transactionsId,
                status: transaction.transactionType,
                transactionAmount: transaction.transactionAmount,
                timeStamp: transaction.timestamp.toISOString(),
            }));
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching transaction history');
        }
    }),


    getWithdrawalHistory: applyMiddlewareToResolver(authMiddlewareGql, async (parent: any, args: any, context: any) => {
        const { req } = context;
        const userId = req.userId;

        if (!userId) {
            throw new Error('Unauthorized: No valid user ID');
        }

        try {
            const withdrawalRequests = await prisma.withdrawalRequests.findMany({ where: { userId: userId },orderBy: { timestamp: 'desc' } });
            if (withdrawalRequests.length === 0) {
                return [];
            }

            return withdrawalRequests.map((withdrawalRequest) => ({
                accountNumber: withdrawalRequest.accountNumber,
                transactionId: withdrawalRequest.transactionsId,
                status: withdrawalRequest.status,
                withdrawalAmount: withdrawalRequest.amount,
                timeStamp: withdrawalRequest.timestamp.toISOString(),
            }));
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching withdrawal requests');
        }
    }),


    getWithdrawalDetails: applyMiddlewareToResolver(authMiddlewareGql, async (parent: any, args: any, context: any) => {
        const { req } = context;
        const userId = req.userId;

        if (!userId) {
            throw new Error('Unauthorized: No valid user ID');
        }

        try {
            const withdrawalDetails = await prisma.withdrawalDetails.findMany({
                where: { userId: userId },
            });

            if (withdrawalDetails.length === 0) {
                throw new Error('Withdrawal details not found');
            }

            return withdrawalDetails.map((withdrawalDetail) => ({
                bankName: withdrawalDetail.bankName,
                accountNumber: withdrawalDetail.accountNumber,
                ifscCode: withdrawalDetail.ifscCode,
            }));
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching withdrawal details');
        }
    }),
};

export const resolvers = { queries };