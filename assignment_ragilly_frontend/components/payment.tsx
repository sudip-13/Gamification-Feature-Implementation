'use client'


import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import visaAnimation from "@/lottie/visa.json"
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


const Payment: React.FC<Props> = ({ close, popup }) => {


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
                    console.log(verificationResult.data.creditPoints)
                    if (verificationResult.data?.creditPoints > 0) {

                        alert(`You have received ${verificationResult.data.creditPoints} credit points.`)
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
                

                if (error.status === 401) {
                    alert('Unauthorized. Please log in first.');
                }
            }
            else {

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
                    className="fixed top-20 left-0 right-0 mx-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] max-w-lg w-[30vw] h-[60vh] p-6 rounded-lg shadow-lg z-50"
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
                            Save account
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="fixed top-20 left-0 right-0 mx-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] max-w-lg w-[30vw] h-[60vh] p-6 rounded-lg shadow-lg z-50"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={popupVariants}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-blue-500 font-bold text-lg">Complete your payment</h1>
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
                        <input
                            placeholder="Enter payment amount"
                            className="bg-inherit px-5 py-2 text-white border border-teal-400 w-full rounded-md focus:outline-none focus:border-teal-200 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            type="text"
                            onChange={handleChange}
                        />
                        <p className="mt-2 text-white flex flex-row space-x-1 items-center">
                            <span className="text-sm ">You will be rewarded :</span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#F19E39"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                            <span className="font-bold text-yellow-500">{creditPoint}</span>
                        </p>
                    </div>
                    <div className="mt-6">
                        <motion.button
                            type="submit"
                            className="w-full active:scale-95 hover:bg-[#ca0c47] duration-300 transition-all bg-[#e91f64] text-white font-semibold rounded-2xl px-4 py-2"
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                            onClick={handleMakePayment}
                        >
                            Make payment
                        </motion.button>
                        <Lottie className="h-60" animationData={visaAnimation} />
                    </div>
                </motion.div>
            )}


        </AnimatePresence>
    );
}

export default Payment;
