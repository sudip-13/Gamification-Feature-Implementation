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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.redemPointsToCash = redemPointsToCash;
exports.submitWithdrawalDetails = submitWithdrawalDetails;
exports.Withdrawal = Withdrawal;
const index_1 = require("../index");
const uuid_1 = require("uuid");
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, email } = req.body;
        if (!userId || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        try {
            const isUserExists = yield index_1.prisma.user.findUnique({
                where: {
                    userId
                }
            });
            if (isUserExists) {
                return res.status(200).json({ msg: 'user logged in successfully' });
            }
            const user = yield index_1.prisma.user.create({
                data: {
                    userId,
                    email
                }
            });
            if (user) {
                return res.status(201).json({ msg: 'user created successfully', userDeatails: user });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function redemPointsToCash(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const { redemPoints } = req.body;
        try {
            const isUserExists = yield index_1.prisma.user.findUnique({ where: { userId } });
            if (!isUserExists) {
                return res.status(404).json({ msg: 'User not found' });
            }
            if (isUserExists.canRedemPoints < redemPoints) {
                return res.status(400).json({ msg: 'Not enough points to redeem' });
            }
            yield index_1.prisma.user.update({
                where: { userId },
                data: { canRedemPoints: isUserExists.canRedemPoints - redemPoints, totalPointsRedeemed: isUserExists.totalPointsRedeemed + redemPoints, redeemedPointsConvertedToCash: isUserExists.redeemedPointsConvertedToCash + (redemPoints * 0.1) },
            });
            res.status(200).json({ msg: 'Points redeemed to cash successfully' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function submitWithdrawalDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const { bankName, accountNumber, ifscCode } = req.body;
        if (!bankName || !accountNumber || !ifscCode) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }
        try {
            const isUserExists = yield index_1.prisma.user.findUnique({ where: { userId } });
            if (!isUserExists) {
                return res.status(404).json({ msg: 'User not found' });
            }
            yield index_1.prisma.withdrawalDetails.create({
                data: {
                    userId: String(userId),
                    bankName: String(bankName),
                    accountNumber: Number(accountNumber),
                    ifscCode: Number(ifscCode)
                },
            });
            res.status(200).json({ msg: 'Withdrawal details submitted successfully' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function Withdrawal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        const { amount, accountNumber } = req.body;
        const transactionId = (0, uuid_1.v4)();
        try {
            const isUserExists = yield index_1.prisma.user.findUnique({ where: { userId } });
            if (!isUserExists) {
                return res.status(404).json({ msg: 'User not found' });
            }
            if (isUserExists.redeemedPointsConvertedToCash < amount) {
                return res.status(400).json({ msg: 'Not enough points to withdraw' });
            }
            yield index_1.prisma.user.update({
                where: { userId },
                data: { redeemedPointsConvertedToCash: isUserExists.redeemedPointsConvertedToCash - amount },
            });
            yield index_1.prisma.withdrawalRequests
                .create({
                data: {
                    userId: String(userId),
                    accountNumber: Number(accountNumber),
                    amount: Number(amount),
                    transactionsId: String(transactionId)
                },
            });
            yield index_1.prisma.history.create({
                data: {
                    userId: String(userId),
                    transactionType: "pending",
                    transactionAmount: Number(amount),
                    transactionsId: String(transactionId)
                },
            });
            res.status(200).json({ msg: 'Withdrawal request submitted successfully' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
