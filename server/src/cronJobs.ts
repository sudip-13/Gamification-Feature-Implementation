import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "./index";



cron.schedule('0 * * * *', async () => {
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


        for (const request of oldRequests) {
            
            await prisma.withdrawalRequests.update({
                where: { id: request.id },
                data: { status: 'success' },
            });

            const historyEntry = await prisma.history.findFirst({
                where: {
                    userId: request.userId,
                    transactionsId: request.transactionsId,
                },
            });

            if (historyEntry) {
   
                await prisma.history.update({
                    where: { id: historyEntry.id },
                    data: { transactionType: 'withdrawal' },
                });
            }
        }

        console.log(`Checked and updated withdrawal requests at ${currentTime}`);
    } catch (error) {
        console.error('Error updating withdrawal requests:', error);
    }
});
