'use client'

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import visaAnimation from "@/lottie/visa.json";
import axios from "axios";
import { loadScript } from '@/lib/script';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface Props {
    popup: string;
    close: () => void;
}

const popupVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
};

const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
};

const Payment: React.FC<Props> = ({ close, popup, }) => {
    const [amount, setAmount] = useState<number>(0);
    const [creditPoint, setCreditpoint] = useState<number>(0);
    const [bankName, setBankName] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<number>(0);
    const [ifscCode, setIfscCode] = useState<string>("");

    const email = useSelector((state: RootState) => state.authToken.email);
    const userName = useSelector((state: RootState) => state.authToken.userName);
    const uId = useSelector((state: RootState) => state.authToken.userId);
    const token = useSelector((state: RootState) => state.authToken.token);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = Number(e.target.value);
        setAmount(newAmount);
        if (newAmount >= 100) {
            setCreditpoint(Math.floor(newAmount / 10));
        } else {
            setCreditpoint(0);
        }
    }, [setCreditpoint, setAmount]);

    const handleMakePayment = useCallback(async () => {
        close();
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const result = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/payment/initialize-payment`,
            { amount: amount }
        );

        if (!result) {
            alert('Server error. Are you online?');
            return;
        }

        const { amount: razorpayAmount, id: order_id, currency } = result.data.order;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
            amount: razorpayAmount.toString(),
            currency: currency,
            name: userName,
            description: 'Test Transaction',
            image: '/transaction.png',
            order_id: order_id,
            handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    userId: uId,
                    creditPoints: creditPoint,
                    data: response,
                };

                try {
                    const verificationResult = await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/payment/verify-payment`,
                        data
                    );

                    close();
                    if (verificationResult.data?.creditPoints > 0) {
                        alert(`You have received ${verificationResult.data.creditPoints} credit points.`);
                    }

                } catch (error) {
                    console.error('Payment verification failed:', error);
                    alert('Payment verification failed. Please try again.');
                }
            },
            prefill: {
                name: userName,
                email: email,
            },
            notes: {
                userId: uId,
            },
            theme: {
                color: '#61dafb',
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }, [amount, creditPoint, uId, email, userName, close]);

    const handleSaveAccount = useCallback(async () => {
        try {
            const result = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/auth/submit-withdrawal-details`,
                { bankName, accountNumber, ifscCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (result.status === 200) {
                alert('Withdrawal details submitted successfully');
                close();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert('Unauthorized. Please log in first.');
                }
            } else {
                console.error('Request error:', error);
                alert('Account save failed. Please try again.');
            }
            close();
        }
    }, [token, bankName, accountNumber, ifscCode, close]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
            />

            {popup === "withdrawl" ? (
                <motion.div
                    className="fixed top-20 left-0 right-0 mx-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] max-w-lg w-[90vw] md:w-[60vw] lg:w-[40vw] h-[60vh] p-6 rounded-lg shadow-lg z-50"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={popupVariants}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-blue-500 font-bold text-lg">Setup your account</h1>
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
                    <div className="flex flex-col gap-5">
                        <input
                            placeholder="Bank name"
                            className="bg-inherit px-5 py-2 text-white border border-teal-400 w-full rounded-md focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            type="text"
                            onChange={(e) => setBankName(e.target.value)}
                        />
                        <input
                            placeholder="Account no."
                            className="bg-inherit px-5 py-2 text-white border border-teal-400 w-full rounded-md focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            type="text"
                            onChange={(e) => setAccountNumber(Number(e.target.value))}
                        />
                        <input
                            placeholder="IFSC code"
                            className="bg-inherit px-5 py-2 text-white border border-teal-400 w-full rounded-md focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            type="text"
                            onChange={(e) => setIfscCode(e.target.value)}
                        />
                    </div>
                    <div className="mt-6">
                        <motion.button
                            type="submit"
                            className="w-full active:scale-95 hover:bg-[#be16d0] duration-300 transition-all bg-[#be16d0] text-white font-semibold rounded-2xl px-4 py-2"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={() => handleSaveAccount()}
                        >
                            Confirm
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="fixed top-20 left-0 right-0 mx-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] max-w-lg w-[90vw] md:w-[60vw] lg:w-[40vw] h-[70vh] p-6 rounded-lg shadow-lg z-50"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={popupVariants}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-blue-500 font-bold text-lg">Make a Payment</h1>
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
                    <div className="relative w-16 h-16 mx-auto">
                        <Lottie animationData={visaAnimation} loop={true} />
                    </div>
                    <div className="mt-6">
                        <input
                            className="bg-inherit text-center text-white px-5 py-3 text-lg border border-teal-400 w-full rounded-md focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            placeholder="Enter amount"
                            type="text"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-3">
                        <h2 className="text-white font-semibold">Credit Points:</h2>
                        <h2 className="text-[#be16d0] font-bold text-xl">{creditPoint}</h2>
                    </div>
                    <div className="mt-6">
                        <motion.button
                            type="submit"
                            className="w-full active:scale-95 hover:bg-[#be16d0] duration-300 transition-all bg-[#be16d0] text-white font-semibold rounded-2xl px-4 py-2"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={() => handleMakePayment()}
                        >
                            Proceed to Pay
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Payment;
