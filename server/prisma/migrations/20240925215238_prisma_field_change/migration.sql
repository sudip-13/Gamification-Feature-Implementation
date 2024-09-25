/*
  Warnings:

  - You are about to drop the column `withdrawalStatus` on the `withdrawalDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "history" ALTER COLUMN "transactionsId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "withdrawalDetails" DROP COLUMN "withdrawalStatus";

-- CreateTable
CREATE TABLE "withdrawalRequests" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "transactionsId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdrawalRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "withdrawalRequests" ADD CONSTRAINT "withdrawalRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
