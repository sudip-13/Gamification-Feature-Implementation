'use client';

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/Animation - 1727594647743.json"

const popupVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
};

interface Props {
    close: () => void;
    openAddAccountPopup: () => void;
}

const withdrawalDetails = gql`
{
 getWithdrawalDetails {
    accountNumber
    bankName
  }
    getWithdrawalHistory {
    accountNumber
    status
    timeStamp
    transactionId
    withdrawalAmount
  }
}


`;

interface WithdrawalDetail {
    accountNumber: number;
    bankName: string;
}

interface WithdrawalHistorys {
    accountNumber: number;
    status: string;
    timeStamp: string;
    transactionId: string;
    withdrawalAmount: number;
}

const Withdrawl: React.FC<Props> = ({ close, openAddAccountPopup }) => {
    const [withdrawaldetails, setWitdrawalDetails] = useState<WithdrawalDetail[]>([]);
    const [withdrawalhistory, setWithdrawalhistory] = useState<WithdrawalHistorys[]>([]);
    const [checkedAccountIndex, setCheckedAccountIndex] = useState<number | null>(null);
    const [showDetails, setShowDetails] = useState<boolean[]>([]);

    const [depositAmount, setDepositAmount] = useState<string>("");
    const [showWithdrawalRequest, setShowWithdrawalRequest] = useState(false);

    const toggleShowDetails = (index: number) => {
        setShowDetails(prev => {
            const newDetails = [...prev];
            newDetails[index] = !newDetails[index]; // Toggle the specific index
            return newDetails;
        });
    };

    const token = useSelector((state: RootState) => state.authToken.token);
    const { loading, data, error, refetch } = useQuery(withdrawalDetails);

    const handleCheckboxChange = (index: number) => {
        setCheckedAccountIndex(index === checkedAccountIndex ? null : index);
    };

    const isAnyChecked = checkedAccountIndex !== null;

    const getCheckedAccountNumbers = useCallback(() => {
        if (checkedAccountIndex !== null) {
            return [withdrawaldetails[checkedAccountIndex].accountNumber];
        }
        return [];
    }, [checkedAccountIndex, withdrawaldetails]);

    const handleDeposit = useCallback(async () => {
        const checkedAccountNumbers = getCheckedAccountNumbers();
        if (checkedAccountNumbers.length === 0) {
            alert("No account selected.");
            return;
        }

        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/auth/withdrawal`,
                {
                    amount: depositAmount,
                    accountNumber: checkedAccountNumbers[0],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            close();
            alert(`${response.data.msg}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
                if (error.response?.status === 400 || error.response?.status === 404) {
                    alert(`${error.response.data.msg}`);
                    close();
                }
                else if (error.response?.status === 401) {
                    alert('Unauthorized. Please log in first.');
                }

                else {
                    console.error("Error:", error);
                    alert("An unexpected error occurred. Please try again.");
                    close();
                }
            }
        }
    }, [depositAmount, token, getCheckedAccountNumbers, close]);


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
        if (data) {
            setWitdrawalDetails(data.getWithdrawalDetails);
            setWithdrawalhistory(data.getWithdrawalHistory);
            console.log("withdrawal data", data);
        }
        if (token) {
            refetch();
        }
    }, [data, error, refetch, token]);

    return (
        <>

            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                />
                <motion.div
                    className="fixed  top-20 left-0 right-0 mx-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] max-w-lg w-[80vw] md:w-[30vw] h-[60vh] p-6 rounded-lg shadow-lg z-50"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={popupVariants}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {loading ? (
                        <div className="absolute inset-0 flex justify-center items-center">
                            <Lottie className="h-80 md:h-96" animationData={loadingAnimation} />
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row gap-10 px-10">
                                    <button className="text-blue-500 font-bold text-lg" onClick={() => setShowWithdrawalRequest(false)}>Cash</button>
                                    <button className="text-blue-500 font-bold text-lg cursor-pointer" onClick={() => setShowWithdrawalRequest(true)}>Requests</button>
                                </div>
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#e8eaed"
                                    whileHover={{ scale: 1.2, rotate: 90 }}
                                    onClick={close}
                                    className="cursor-pointer"
                                >
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                </motion.svg>
                            </div>
                            <div className="border border-slate-800 my-4"></div>
                            {showWithdrawalRequest ? (
                                <div >
                                    <h2 className="text-rose-500">Withdrawal Request</h2>
                                    {withdrawalhistory.map((history, idx) => (
                                        <div key={idx}>
                                            <div className="mt-5 flex flex-row gap-16  " >
                                                <div className="text-white text-sm flex flex-row justify-between w-full items-center">
                                                    <p className="text-sm flex justify-center flex-row items-center space-x-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#78A75A"><path d="M480-250q63.67-15.67 105.17-73.17t41.5-127.02v-93.3L480-616.67l-146.67 73.18v93.3q0 69.52 41.71 127.03Q416.75-265.64 480-250ZM160-120v-480l320-240 320 240v480H160Zm66.67-66.67h506.66v-382.66L480-755.33l-253.33 186v382.66ZM480-471.33Z" /></svg>
                                                        <span>
                                                            {history.withdrawalAmount}
                                                        </span>
                                                    </p>
                                                    <p className=" text-sm text-blue-500">{history.status}</p>
                                                    <p>{formatDate(history.timeStamp)}</p>
                                                    <svg id="toggle" onClick={() => toggleShowDetails(idx)} className="rotate-90 ease-in-out duration-300 cursor-pointer" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#e8eaed"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
                                                </div>
                                            </div>
                                            {showDetails[idx] && (
                                                <div className="flex flex-col gap-2 mt-3 text-slate-500">
                                                    <p>Transaction id : {history.transactionId}</p>
                                                    <p>Account no. : {history.accountNumber}</p>
                                                    <p>Transaction amount : {history.withdrawalAmount}</p>
                                                    <p>Transaction status : {history.status}</p>
                                                </div>
                                            )}
                                            <div className="border border-slate-700 my-6 px-5"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-rose-500">Saved accounts</h2>
                                    {withdrawaldetails.map((details, idx) => (
                                        <div className="mt-5 flex flex-row gap-5" key={idx}>
                                            <input
                                                type="checkbox"
                                                checked={checkedAccountIndex === idx}
                                                className="transform scale-150 mr-2 cursor-pointer"
                                                onChange={() => handleCheckboxChange(idx)}
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#3da130">
                                                <path d="M208-254v-319.33h66.67V-254H208Zm241.33 0v-319.33H516V-254h-66.67ZM80-120.67v-66.66h800v66.66H80ZM685.33-254v-319.33H752V-254h-66.67ZM80-640v-62l400-218.67L880-702v62H80Zm148.67-66.67h502.66-502.66Zm0 0h502.66L480-844.67l-251.33 138Z" />
                                            </svg>
                                            <div className="text-white text-sm">
                                                <p className="text-lg">{details.bankName}</p>
                                                <p className="text-slate-500">{details.accountNumber}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isAnyChecked && (
                                        <div className="my-6">
                                            <div className="border border-slate-700 my-6 px-5"></div>
                                            <input
                                                placeholder="Enter Deposit Amount"
                                                className="bg-inherit px-5 py-2 mb-6 text-white border border-teal-400 w-full rounded-md focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                                                type="text"
                                                onChange={(e) => setDepositAmount(e.target.value)}
                                            />
                                            <div className="flex justify-center">
                                                <Button variant="contained" onClick={handleDeposit}>Deposit</Button>
                                            </div>
                                        </div>
                                    )}
                                    {!isAnyChecked && (
                                        <div>
                                            <div className="border border-slate-700 my-6 px-5"></div>
                                            <div className="flex justify-center">
                                                <Button onClick={openAddAccountPopup} variant="contained">Add Account</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

        </>
    );
};

export default Withdrawl;