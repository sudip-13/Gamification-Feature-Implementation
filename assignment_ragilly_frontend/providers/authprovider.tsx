"use client";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { auth } from "@/config/firebase/config";
import { useDispatch } from 'react-redux';
import { useAuthState } from "react-firebase-hooks/auth";
import { setEmail, setToken, setUserId, setUserName } from "@/lib/resolvers/auth";

interface AuthTokenContextType {
    authToken: string | null;
}

// Create the context
const AuthTokenContext = createContext<AuthTokenContextType | undefined>(undefined);

// Create the provider component
export const AuthTokenProvider = ({ children }: { children: ReactNode }) => {
    const [authToken, setAuthToken] = useState<string>("");
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);

    const getAuthToken = useCallback(async () => {
        if (user) {
            const idToken = await user.getIdToken();
            dispatch(setToken(idToken));
            setAuthToken(idToken);
        }

    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            getAuthToken();
            if (user.email) dispatch(setEmail(user.email));
            if (user.displayName) dispatch(setUserName(user.displayName));
            if (user.uid) dispatch(setUserId(user.uid));
        }
    }, [authToken, dispatch, getAuthToken, user])

    return (
        <AuthTokenContext.Provider value={{ authToken }}>
            {children}
        </AuthTokenContext.Provider>
    );
};

// Hook to access the auth token
export const useAuthToken = (): AuthTokenContextType => {
    const context = useContext(AuthTokenContext);
    if (!context) {
        throw new Error("useAuthToken must be used within an AuthTokenProvider");
    }
    return context;
};