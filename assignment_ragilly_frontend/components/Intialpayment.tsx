'use client';

import axios from 'axios';
import { loadScript } from '@/lib/script';
import { useCallback, useState } from 'react';
import { Input } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export const InitialPayment = () => {
    const [amount, setAmount] = useState<number>(0);
    const [creditPoint, setCreditpoint] = useState<number>(0);
    const [transactionId, setTransactionId] = useState<string>('');
    const router = useRouter();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = Number(e.target.value);

        setAmount(newAmount);
        if (newAmount >= 100) {
            setCreditpoint(Math.floor(newAmount / 10));
        } else {
            setCreditpoint(0);
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const result = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/payment/initialize-payment`,
            {
                amount: amount,
            }
        );

        if (!result) {
            alert('Server error. Are you online?');
            return;
        }
        console.log(result.data);
        const { amount: razorpayAmount, id: order_id, currency } = result.data.order;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
            amount: razorpayAmount.toString(),
            currency: currency,
            name: 'username firebase',
            description: 'Test Transaction',
            image: 'https://th.bing.com/th/id/OIP.g5AKW21APdv9ToQ-pwgo9AHaGK?rs=1&pid=ImgDetMain',
            order_id: order_id,
            handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    userId: "firebase USerId",
                    creditPoints:creditPoint,
                    data: response,
                };

                const verificationResult = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/payment/verify-payment`,
                    data
                );
                console.log(verificationResult)

                //popup verificationResult.msg
                setTransactionId(verificationResult.data.paymentId)

            },
            prefill: {
                name: 'firebase username',
                email: 'firebase email',
                contact: 'firebase contact',
            },
            notes: {
                userId: 'firebase userId',
            },
            metadata: {
                "userID": "firebase userID",
                "Transaction Amount": amount,
                "Transaction Id": transactionId
            },
            theme: {
                color: '#61dafb',
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }, [amount, router, setTransactionId, transactionId,creditPoint]);

    return (
        <div>
            <p>Getting point: {creditPoint}</p>
            <Input
                isClearable
                type="number"
                variant="bordered"
                placeholder="Enter Amount"
                onChange={handleChange}
                className="max-w-xs"
            />
            <button onClick={handleSubmit}>
                Payment
            </button>
        </div>
    );
};
