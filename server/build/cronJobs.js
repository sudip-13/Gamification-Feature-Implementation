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
const node_cron_1 = __importDefault(require("node-cron"));
const index_1 = require("./index");
node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date();
    try {
        const oldRequests = yield index_1.prisma.withdrawalRequests.findMany({
            where: {
                timestamp: {
                    lt: new Date(currentTime.getTime() - 12 * 60 * 60 * 1000),
                },
                status: 'pending',
            },
        });
        for (const request of oldRequests) {
            yield index_1.prisma.withdrawalRequests.update({
                where: { id: request.id },
                data: { status: 'success' },
            });
            const historyEntry = yield index_1.prisma.history.findFirst({
                where: {
                    userId: request.userId,
                    transactionsId: request.transactionsId,
                },
            });
            if (historyEntry) {
                yield index_1.prisma.history.update({
                    where: { id: historyEntry.id },
                    data: { transactionType: 'withdrawal' },
                });
            }
        }
        console.log(`Checked and updated withdrawal requests at ${currentTime}`);
    }
    catch (error) {
        console.error('Error updating withdrawal requests:', error);
    }
}));
