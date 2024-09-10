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
exports.login = exports.register = void 0;
const firebase_1 = require("../services/firebase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.JWT_SECRET;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    if (!email || !password)
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    // Check for valid status
    if (role && !['user', 'admin', ' '].includes(role.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role',
        });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = { email, password: hashedPassword, role: role || 'user', accout: 'active' };
    const userRef = firebase_1.firestore.collection('users').doc();
    yield userRef.set(newUser);
    return res.status(201).json({
        success: true,
        message: 'User registered successfully'
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userQuery = yield firebase_1.firestore.collection('users').where('email', '==', email).get();
    if (userQuery.empty)
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    const user = userQuery.docs[0].data();
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    const token = jsonwebtoken_1.default.sign({ id: userQuery.docs[0].id, role: user.role }, SECRET, {
        expiresIn: '1h',
    });
    return res.status(200).json({
        success: true,
        token
    });
});
exports.login = login;
