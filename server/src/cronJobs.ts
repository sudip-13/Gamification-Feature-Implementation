import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient()



const checkAndUpdateWithdrawalRequests = async () => {

    const currentTime = new Date();

    try {

        const oldRequests = await prisma.withdrawalRequests.findMany({
            where: {
                timestamp: {
                    lt: new Date(currentTime.getTime() - 12 * 60 * 60 * 1000),
                },
                status: 'pending',
            },
        });




        const BATCH_SIZE = 10;
        for (let i = 0; i < oldRequests.length; i += BATCH_SIZE) {
            const batch = oldRequests.slice(i, i + BATCH_SIZE);
            const updatePromises = batch.map(async (request) => {
                return prisma.$transaction(async (tx) => {
                    await tx.withdrawalRequests.update({
                        where: { id: request.id },
                        data: { status: 'withdrawal' },
                    });

                    const historyEntry = await tx.history.findFirst({
                        where: {
                            userId: request.userId,
                            transactionsId: request.transactionsId,
                        },
                    });

                    if (historyEntry) {
                        await tx.history.update({
                            where: { id: historyEntry.id },
                            data: { transactionType: 'withdrawal' },
                        });
                    }
                });
            });

            await Promise.all(updatePromises);
        }

        console.log(`Checked and updated withdrawal requests at ${currentTime}`);
    } catch (error) {
        console.error('Error updating withdrawal requests:', error);
    }
};


cron.schedule('*/15 * * * *', checkAndUpdateWithdrawalRequests);


checkAndUpdateWithdrawalRequests();
