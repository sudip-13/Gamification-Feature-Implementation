// WithdrawalSteps.tsx
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface Props {
    close: () => void;
}

const stepVariants = {
    hidden: { translateY: -50, opacity: 0 },
    visible: { translateY: 0, opacity: 1 },
    exit: { translateY: -50, opacity: 0 },
};

const WithdrawalRequests: React.FC<Props> = ({ close }) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
            >
                <motion.div
                    className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepVariants}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-bold">Withdrawal Steps</h2>
                    <ol className="list-decimal pl-5">
                        <li>Choose an account</li>
                        <li>Enter amount</li>
                        <li>Confirm withdrawal</li>
                    </ol>
                    <button onClick={close} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WithdrawalRequests;
