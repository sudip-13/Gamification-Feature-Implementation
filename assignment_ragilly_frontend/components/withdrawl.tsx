'use client'

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import axios from "axios";

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
}

`

interface withdrawalDetails {
    accountNumber: number,
    bankName: string,

}


const Withdrawl: React.FC<Props> = ({ close, openAddAccountPopup }) => {

    const [withdrawaldetails, setWitdrawalDetails] = useState<withdrawalDetails[]>([])
    const [checkedAccounts, setCheckedAccounts] = useState<boolean[]>([]);
    const [depositAmount, setDepositAmount] = useState<string>("");


    const token = useSelector((state: RootState) => state.authToken.token);

    const { data, error, refetch } = useQuery(withdrawalDetails);

    const handleCheckboxChange = (index: number) => {
        const newCheckedAccounts = [...checkedAccounts];
        newCheckedAccounts[index] = !newCheckedAccounts[index];
        setCheckedAccounts(newCheckedAccounts);
    };

    const isAnyChecked = checkedAccounts.some(checked => checked);


    const getCheckedAccountNumbers = useCallback(() => {
        return withdrawaldetails
            .filter((_, idx) => checkedAccounts[idx])
            .map(detail => detail.accountNumber);
    }, [checkedAccounts, withdrawaldetails]);


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

            close()
            alert(`${response.data.msg}`);
        } catch (error) {

            if (axios.isAxiosError(error)) {
                console.log(error)
                if (error.status === 400 || error.status === 404) {

                    alert(`${error.response?.data.msg}`)
                    close()
                } else {

                    console.error("Error:", error);
                    alert("An unexpected error occurred. Please try again.");
                    close()
                }
            }
        }
    }, [depositAmount, token, getCheckedAccountNumbers, close]);


    useEffect(() => {
        if (data) {
            setWitdrawalDetails(data.getWithdrawalDetails)
        }
        if (token) {
            refetch()
        }
    }, [data, error, refetch, token]);




    return (
        <AnimatePresence>
            {/* Backdrop for blur effect and disabling interaction */}
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close} // Close popup on clicking backdrop
            />
            <motion.div
                className="fixed top-20 left-0 right-0 mx-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] max-w-lg w-[30vw] h-[60vh] p-6 rounded-lg shadow-lg z-50"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={popupVariants}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-blue-500 font-bold text-lg">Withdrawl your cash</h1>
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
                <div>
                    <h2 className="text-rose-500">Saved accounts</h2>
                    {withdrawaldetails.map((details, idx) => (
                        <div className="mt-5 flex flex-row gap-5 " key={idx}>
                            <input
                                type="checkbox"
                                checked={checkedAccounts[idx]}
                                className="transform scale-150 mr-2 cursor-pointer"
                                onChange={() => handleCheckboxChange(idx)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#3da130"><path d="M208-254v-319.33h66.67V-254H208Zm241.33 0v-319.33H516V-254h-66.67ZM80-120.67v-66.66h800v66.66H80ZM685.33-254v-319.33H752V-254h-66.67ZM80-640v-62l400-218.67L880-702v62H80Zm148.67-66.67h502.66-502.66Zm0 0h502.66L480-844.67l-251.33 138Z" /></svg>
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
                            <div className=" flex justify-center">
                                <Button variant="contained" onClick={() => handleDeposit()}>Deposit</Button>
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
            </motion.div>

        </AnimatePresence >
    )
}

export default Withdrawl;