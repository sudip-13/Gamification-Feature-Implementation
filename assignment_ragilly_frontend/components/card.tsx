"use client"
import React, { useCallback } from "react";
import { Meteors } from "@/components/ui/meteors";
import axios from "axios";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

interface Props {
    points: number;
    money: number;
}





const CardComponent: React.FC<Props> = ({ points, money }) => {

    const token = useSelector((state: RootState) => state.authToken.token);


    const handleRedeemPoints = useCallback(async (points: number) => {


        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/auth/redeem-points-to-cash`,
                {
                    redemPoints: points
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            close();
            alert(`${response.data.msg}`);
        }


        catch (error) {

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
    }, [token])


    return (
        <div className="">
            <div className=" w-full relative max-w-xs">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
                <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                    <h1 className="font-bold text-yellow-500 text-xl mb-4 flex space-x-1 flex-row items-center relative z-50">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                        {points}
                    </h1>
                    <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
                        Redeem {points} point to get {money} Rupees
                    </p>

                    <button className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300" onClick={() => handleRedeemPoints(points)}>
                        Redeem
                    </button>
                    <Meteors number={20} />
                </div>
            </div>
        </div>
    )
}

export default CardComponent;