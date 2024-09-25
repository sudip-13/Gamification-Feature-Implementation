-- CreateTable
CREATE TABLE "withdrawalDetails" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "ifscCode" INTEGER NOT NULL,
    "withdrawalStatus" TEXT NOT NULL DEFAULT 'pending',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdrawalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "withdrawalDetails_userId_idx" ON "withdrawalDetails"("userId");

-- AddForeignKey
ALTER TABLE "withdrawalDetails" ADD CONSTRAINT "withdrawalDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
