"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("../firebase.admin"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: 'No token provided', code: "NTP" });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(token);
        if (!decodedToken) {
            return res.status(401).json({ msg: 'Invalid token', code: "NTP" });
        }
        req.userId = decodedToken.uid;
        next();
    }
    catch (error) {
        console.error('Error verifying Firebase token:', error);
        res.status(401).json({ msg: 'Unauthorized', code: "NTP" });
    }
});
exports.default = authMiddleware;
