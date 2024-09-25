import express, { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from "../index";


const router = express.Router();


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

router.post('/initialize-payment', async (req: Request, res: Response) => {
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

        const order = await razorpayInstance.orders.create(options)
        console.log("Order created:", order);
        return res.status(200).send({ order });

    } catch (err: any) {
        console.error("Error creating order:", err);
        return res.status(500).send({ error: err.error.description, msg: "Error creating order" });
    }
});



router.post('/verify-payment', async (req: Request, res: Response) => {
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            userId,
            creditPoints,
            data
        } = req.body;
        const details = await razorpayInstance.payments.fetch(razorpayPaymentId)

        const amount: number = Number(details.amount) / 100

        console.log(`userId: ${userId},amount: ${amount},creditPoints: ${creditPoints}`);

        const shasum = crypto.createHmac('sha256', `${process.env.RAZORPAY_KEY_SECRET}`);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: 'Transaction not legit!' });

        const isUserExists = await prisma.user.findUnique({
            where: {
                userId
            }
        })
        if (!isUserExists) {
            return res.status(404).json({ msg: 'user lnot found' });
        }
        await prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { userId },
                data: {
                    canRedemPoints: isUserExists.canRedemPoints + creditPoints,
                    noOfTransactions: isUserExists.noOfTransactions + 1
                }
            });

            await prisma.history.create({
                data: {
                    userId,
                    transactionAmount: Math.round(amount),
                    transactionsId: razorpayPaymentId,
                }
            });
        });

        res.status(200).json({
            msg: 'transaction successfully completed',
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            creditPoints: creditPoints
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

})



export default router;