"use client"
import React, { useEffect, useState } from "react";
import HorizontalLinearAlternativeLabelStepper from "@/components/steper";
import Payment from "@/components/payment";
import { useSelector } from 'react-redux';
import Withdrawl from "@/components/withdrawl";
import CardComponent from "@/components/card";
import { gql, useQuery } from '@apollo/client';
import { RootState } from "@/lib/store";


const User_Details = gql`{
    Index {
        msg
    }
    getUserData {
    cash
    noOfTransaction
    redeemablePoints
  }

  getTransactionHistory {
    status
    timeStamp
    transactionAmount
    transactionId
  }

}

`;


interface userData {
    cash: number;
    noOfTransaction: number
    redeemablePoints: number
}

interface TransactionHistory {
    status: string
    timeStamp: string
    transactionAmount: number
    transactionId: string
}
const Dashboard: React.FC = () => {
    const token = useSelector((state: RootState) => state.authToken.token);
    const email = useSelector((state: RootState) => state.authToken.email);
    const userId = useSelector((state: RootState) => state.authToken.userId);
    const userName = useSelector((state: RootState) => state.authToken.userName);
    const [addBankAccount, setAddBankAccount] = useState<boolean>(false);
    const [withdrawlPopup, setWithdrawlPopup] = useState<boolean>(false);
    const {  error, data, refetch } = useQuery(User_Details);
    const [userData, setUserData] = useState<userData[]>([])
    const [TransactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([])

    const handleClose = () => {
        setAddBankAccount(false);
    }
    const closeWithdrawlPopup = () => {
        setWithdrawlPopup(false);
    }
    const handleAddBankAccount = () => {
        closeWithdrawlPopup()
        setAddBankAccount(true);
    }

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });


        const suffix = (day: number) => {
            if (day >= 11 && day <= 13) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}${suffix(day)} ${month} ${hours}:${minutes}:${seconds}`;
    };


    useEffect(() => {
        if (error) {
            console.log("error fetching data", error);
        }
        if (data) {
            console.log("data fetched", data);
            setUserData(data.getUserData)
            setTransactionHistory(data.getTransactionHistory)
        }
        if (token) {
            refetch()

        }
    }, [error, data, refetch, token]);

    useEffect(() => {
        console.log(token, email, userId, userName)
    }, [email, token, userId, userName])



    return (
        <>
            <div className="min-h-screen pb-10 w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col justify-center">
                <nav className="py-4 px-6 md:px-[10rem] mt-5">
                    <ul className="flex flex-row items-center justify-between space-x-4 md:space-x-8">
                        <li className="flex flex-row space-x-1 items-center cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z" /></svg>
                            <span className="text-red-600 text-sm md:text-base">Transactions</span>
                        </li>
                        <li onClick={() => setWithdrawlPopup(true)} className="flex flex-row items-center space-x-1 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Z" /></svg>
                            <span className="text-white text-sm md:text-base">Withdrawl</span>
                        </li>
                        <ul className="flex flex-row gap-4">
                            <li className="flex flex-row items-center space-x-1 cursor-pointer border px-5 py-0.5 border-slate-500 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760H520q-71 0-115.5 44.5T360-600v240q0 71 44.5 115.5T520-200h320q0 33-23.5 56.5T760-120H200Zm320-160q-33 0-56.5-23.5T440-360v-240q0-33 23.5-56.5T520-680h280q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280H520Zm120-140q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Z" /></svg>
                                <span className="text-white text-sm md:text-base">{userData[0]?.cash}</span>
                            </li>
                            <li className="flex flex-row items-center space-x-1 cursor-pointer border px-5 py-0.5 border-slate-500 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                                <span className="text-white text-sm md:text-base">{userData[0]?.redeemablePoints}</span>
                            </li>
                        </ul>
                    </ul>
                </nav>
                <div className="px-4 md:px-12 mt-10">
                    <HorizontalLinearAlternativeLabelStepper />
                </div>
                <div className="flex flex-row justify-evenly">
                    <CardComponent points={100} money={10} />
                    <CardComponent points={200} money={20} />
                    <CardComponent points={500} money={50} />
                    <CardComponent points={1000} money={100} />
                </div>
                <div className="px-4 md:ml-20 py-4 bg-gray-900 overflow-y-auto md:px-9 mt-6 border-gray-800 w-[90vw] h-[30rem] rounded-md [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full">
                    <div className="space-y-2">
                        {TransactionHistory.map((transaction, idx) => (
                            <section key={idx} className="text-white flex flex-row justify-between">
                                <p className="flex space-x-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z" />
                                    </svg>
                                    <span>{transaction.transactionId}</span>
                                </p>
                                <p className="flex space-x-1 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M549-120 280-400v-80h140q53 0 91.5-34.5T558-600H240v-80h306q-17-35-50.5-57.5T420-760H240v-80h480v80H590q14 17 25 37t17 43h88v80h-81q-8 85-70 142.5T420-400h-29l269 280H549Z" />
                                    </svg>
                                    <span>{transaction.transactionAmount}</span>
                                </p>
                                <p className="flex space-x-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
                                    </svg>
                                    <span>{transaction.status}</span>
                                </p>
                                <p className="flex space-x-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M320-400q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm160 0q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm160 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Z" />
                                    </svg>
                                    <span>{formatDate(transaction.timeStamp)}</span>
                                </p>
                            </section>
                        ))}
                    </div>
                </div>

            </div>
            {addBankAccount && <Payment popup={"withdrawl"} close={handleClose} />}
            {withdrawlPopup && <Withdrawl close={closeWithdrawlPopup} openAddAccountPopup={handleAddBankAccount} />}
        </>
    );
};

export default Dashboard;
