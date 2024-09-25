import { Router, Request, Response } from "express";
import {createUser,redemPointsToCash,submitWithdrawalDetails,Withdrawal} from '../auth/index'
import authMiddleware from '../middleware/authmiddleware';
const router: Router = Router();

router.post('/login',createUser)



router.patch('/redeem-points-to-cash',authMiddleware, redemPointsToCash)

router.post('/submit-withdrawal-details',authMiddleware, submitWithdrawalDetails)

router.patch('/withdrawal',authMiddleware, Withdrawal)

export default router;
