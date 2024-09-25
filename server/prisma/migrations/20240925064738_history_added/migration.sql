-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalPointsRedeemed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "transactionsId" INTEGER NOT NULL,
    "transactionAmount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "history_userId_idx" ON "history"("userId");
