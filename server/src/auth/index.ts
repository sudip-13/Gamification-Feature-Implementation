import { prisma } from "../index";
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export async function createUser(req: Request, res: Response) {
    const { userId, email } = req.body;

    if (!userId || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const isUserExists = await prisma.user.findUnique({
            where: {
                userId
            }
        })
        if (isUserExists) {
            return res.status(200).json({ msg: 'user logged in successfully' });
        }
        const user = await prisma.user.create({
            data: {
                userId,
                email
            }
        })
        if (user) {
            return res.status(201).json({ msg: 'user created successfully', userDeatails: user });
        }
    } catch (error) {

        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });

    }

}




export async function redemPointsToCash(req: Request, res: Response) {

    const userId = req.userId;
    const { redemPoints } = req.body;
    try {
        const isUserExists = await prisma.user.findUnique({ where: { userId } })
        if (!isUserExists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (isUserExists.canRedemPoints < redemPoints) {
            return res.status(400).json({ msg: 'Not enough points to redeem' });
        }

        await prisma.user.update({
            where: { userId },
            data: { canRedemPoints: isUserExists.canRedemPoints - redemPoints, totalPointsRedeemed: isUserExists.totalPointsRedeemed + redemPoints, redeemedPointsConvertedToCash: isUserExists.redeemedPointsConvertedToCash + (redemPoints * 0.1) },
        });
        res.status(200).json({ msg: 'Points redeemed to cash successfully' })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }

}



export async function submitWithdrawalDetails(req: Request, res: Response) {
    const userId = req.userId;
    const { bankName, accountNumber, ifscCode } = req.body;

    if (!bankName || !accountNumber || !ifscCode) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
        const isUserExists = await prisma.user.findUnique({ where: { userId: String(userId) } })
        if (!isUserExists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await prisma.withdrawalDetails.create({

            data: {
                userId: String(userId),
                bankName: String(bankName),
                accountNumber: Number(accountNumber),
                ifscCode: String(ifscCode)
            },
        })

        res.status(200).json({ msg: 'Withdrawal details submitted successfully' });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}





export async function Withdrawal(req: Request, res: Response) {
    const userId = req.userId;
    const { amount, accountNumber } = req.body;
    const transactionId = uuidv4();

    try {
        const isUserExists = await prisma.user.findUnique({ where: { userId } });
        if (!isUserExists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (isUserExists.redeemedPointsConvertedToCash < amount) {
            return res.status(400).json({ msg: 'Not enough amount to withdraw' });
        }

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { userId },
                data: { redeemedPointsConvertedToCash: isUserExists.redeemedPointsConvertedToCash - amount },
            });

            await tx.withdrawalRequests.create({
                data: {
                    userId: String(userId),
                    accountNumber: Number(accountNumber),
                    amount: Number(amount),
                    transactionsId: String(transactionId),
                },
            });

            await tx.history.create({
                data: {
                    userId: String(userId),
                    transactionType: "pending",
                    transactionAmount: Number(amount),
                    transactionsId: String(transactionId),
                },
            });
        });

        res.status(200).json({ msg: 'Withdrawal request submitted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
