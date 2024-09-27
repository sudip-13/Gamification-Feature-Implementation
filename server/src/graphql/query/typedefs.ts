export const typeDefs = `#graphql

type Index {
    msg: String
}

type GetUserData {
    redeemablePoints: Float
    noOfTransaction: Int
    cash: Float
}

type TransactionHistory {
    transactionId: String
    status: String
    transactionAmount: Float
    timeStamp: String
}

type WithdrawalDetails {
    bankName: String
    accountNumber: String
    ifscCode: String
}

type WithdrawalHistory {
    accountNumber: String
    withdrawalAmount: Float
    transactionId: String
    timeStamp: String
    status: String
}
`;