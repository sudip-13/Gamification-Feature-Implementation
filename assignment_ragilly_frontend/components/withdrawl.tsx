import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";

const popupVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
};

interface Props {
    close: () => void;
    openAddAccountPopup: () => void;
}


const Withdrawl: React.FC<Props> = ({ close,openAddAccountPopup }) => {
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
                    <div className="mt-5 flex flex-row gap-5 ">
                        <Image height={60} width={60} src={"https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/05/Mastercard_2019_logo.svg-e1659036851269.png?auto=format&q=60&fit=max&w=930"} alt={"Logo"} />
                        <div className="text-white text-sm">
                            <p className="text-lg">Mukesh Gupta</p>
                            <p className="text-slate-500">85804805845</p>
                        </div>
                    </div>
                    <div className="border border-slate-700 mt-4 px-5"></div>
                    <Button onClick={openAddAccountPopup} className="ml-32 mt-10" variant="contained">Add Account</Button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default Withdrawl;