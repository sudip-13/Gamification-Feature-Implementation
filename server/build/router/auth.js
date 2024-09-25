"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../auth/index");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
const router = (0, express_1.Router)();
router.post('/login', index_1.createUser);
router.patch('/redeem-points-to-cash', authmiddleware_1.default, index_1.redemPointsToCash);
router.post('/submit-withdrawal-details', authmiddleware_1.default, index_1.submitWithdrawalDetails);
router.patch('/withdrawal', authmiddleware_1.default, index_1.Withdrawal);
exports.default = router;
