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
const express_1 = __importDefault(require("express"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const index_1 = require("../index");
const router = express_1.default.Router();
const razorpayInstance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
router.post('/initialize-payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
        return res.status(400).send({ error: 'Invalid amount', statusCode: "EVA" });
    }
    try {
        const options = {
            amount: Number(amount * 100),
            currency: 'INR',
            receipt: 'receipt#1',
            notes: {
                amount: 'value3',
                key2: 'value2',
            },
        };
        const order = yield razorpayInstance.orders.create(options);
        console.log("Order created:", order);
        return res.status(200).send({ order });
    }
    catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).send({ error: err.error.description, msg: "Error creating order" });
    }
}));
router.post('/verify-payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, userId, creditPoints, data } = req.body;
        const details = yield razorpayInstance.payments.fetch(razorpayPaymentId);
        const amount = Number(details.amount) / 100;
        console.log(`userId: ${userId},amount: ${amount},creditPoints: ${creditPoints}`);
        const shasum = crypto_1.default.createHmac('sha256', `${process.env.RAZORPAY_KEY_SECRET}`);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: 'Transaction not legit!' });
        const isUserExists = yield index_1.prisma.user.findUnique({
            where: {
                userId
            }
        });
        if (!isUserExists) {
            return res.status(404).json({ msg: 'user lnot found' });
        }
        yield index_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.user.update({
                where: { userId },
                data: {
                    canRedemPoints: isUserExists.canRedemPoints + creditPoints,
                    noOfTransactions: isUserExists.noOfTransactions + 1
                }
            });
            yield prisma.history.create({
                data: {
                    userId,
                    transactionAmount: Math.round(amount),
                    transactionsId: razorpayPaymentId,
                }
            });
        }));
        res.status(200).json({
            msg: 'transaction successfully completed',
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            creditPoints: creditPoints
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}));
exports.default = router;
