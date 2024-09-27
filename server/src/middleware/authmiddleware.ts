import { Request, Response, NextFunction } from 'express';
import admin from '../firebase.admin';


declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}



export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ msg: 'No token provided', code: "NTP" });
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ msg: 'Invalid token', code: "NTP" });
        }

        req.userId = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ msg: 'Unauthorized', code: "NTP" });
    }
};



export const authMiddlewareGql = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {

            req.userId = undefined;
            return next();
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {

            req.userId = undefined;
            return next();
        }

        req.userId = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        req.userId = undefined;
        next();
    }
};




