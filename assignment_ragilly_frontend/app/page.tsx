"use client";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setToken, setUserId, setUserName } from "@/lib/resolvers/auth";
import React, { useCallback, useEffect, useState } from "react";
import { LampContainer } from "@/components/ui/lamp";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Payment from "@/components/payment";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase/firebase/config";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { RootState } from "@/lib/store";
import { loginToDatabase } from "@/api";
import AlertPopup from "@/components/alert";

export default function Home() {
  const token = useSelector((state: RootState) => state.authToken.token);
  const email = useSelector((state: RootState) => state.authToken.email);

  const uId = useSelector((state: RootState) => state.authToken.userId);
  const dispatch = useDispatch();
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [severity, setSeverity] = useState<boolean>(false);

  const handleShowAlert = useCallback((msg: string) => {
    setAlertMsg(msg);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("firebase error", error);
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

  const loginToDB = useCallback(async () => {
    if (email && uId) {
      const response = await loginToDatabase(email, uId);
      if (response.status === 1) {
        setSeverity(true);
        handleShowAlert("You are now logged in");
      } else {
        setSeverity(false);
        handleShowAlert("You have been logged out, some features are disabled, please log in");
      }
    }
  }, [email, uId, handleShowAlert]);

  const checkLogin = useCallback(async () => {
    if (user) {
      setIsLoggedIn(true);
      setDisabled(false);
      if (user.email) dispatch(setEmail(user.email));
      if (user.displayName) dispatch(setUserName(user.displayName));
      if (user.uid) dispatch(setUserId(user.uid));
      const idToken = await user.getIdToken();
      dispatch(setToken(idToken));
    } else {
      setSeverity(false);
      handleShowAlert("You have been logged out, some features are disabled, please log in");
      setIsLoggedIn(false);
      setDisabled(true);
    }
  }, [dispatch, handleShowAlert, user]);

  useEffect(() => {
    loginToDB();
  }, [loginToDB, token]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <>
      <LampContainer>
        <div className="flex flex-col items-center justify-center">
          <p className="text-white dark:text-neutral-200 text-xs sm:text-sm">
            The road to freedom starts from here
          </p>
          <TypewriterEffectSmooth className="mb-5 sm:mb-10" words={words} />

          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <button
              disabled={disabled}
              onClick={() => setShowPaymentPopup(true)}
              className="relative flex space-x-2 font-bold px-4 py-2 sm:px-8 sm:py-2 rounded-md bg-inherit z-10 border-2 border-teal-500 overflow-hidden transition-all duration-700 hover:bg-teal-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
                <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
              </svg>
              <span className="text-white text-center">Make a payment</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
                <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
              </svg>
            </button>

            <Link href="/dashboard">
              <button
                disabled={disabled}
                className="relative flex space-x-3 font-bold px-4 py-2 sm:px-8 sm:py-2 rounded-md bg-inherit z-10 border-2 border-rose-500 transition-all duration-700 hover:bg-rose-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
                  <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
                </svg>
                <span className="text-white">Dashboard</span>
                <svg className="hover:-rotate-45 ease-in-out duration-300 transition-all" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
                  <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
                </svg>
              </button>
            </Link>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="relative flex space-x-3 font-bold px-4 py-2 sm:px-8 sm:py-2 rounded-md bg-inherit z-10 border-2 border-lime-500 transition-all duration-700 hover:bg-lime-500">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                </svg>
                <span className="text-white">Logout</span>
              </button>
            ) : (
              <button onClick={handleGoogleLogin} className="relative flex space-x-3 font-bold px-4 py-2 sm:px-8 sm:py-2 rounded-md bg-inherit z-10 border-2 border-lime-500 transition-all duration-700 hover:bg-lime-500">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed">
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                </svg>
                <span className="text-white">Login</span>
              </button>
            )}
          </div>
        </div>
      </LampContainer>
      {showPaymentPopup && <Payment popup={"kalua"} close={closePaymentPopup} />}
      {showAlert && <AlertPopup message={alertMsg} severity={severity} />}
    </>
  );
}

const words = [
  { text: "Welcome" },
  { text: "to" },
  { text: "Payment", className: "text-blue-500 dark:text-blue-500" },
  { text: "Hub", className: "text-blue-500 dark:text-blue-500" },
];
