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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleUser = exports.deleteUserAccount = exports.toggleUserRole = exports.toggleUserStatus = void 0;
const firebase_1 = require("../services/firebase");
const toggleUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // ID of the user to toggle status
    const { status } = req.query;
    if (typeof status !== 'string' || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status',
        });
    }
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only admins can perform this action.',
            });
        }
        else {
            const userRef = firebase_1.firestore.collection('users').doc(userId);
            const userDoc = yield userRef.get();
            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            // Update user status
            yield userRef.update({ status });
            return res.status(200).json({
                success: true,
                message: `User status updated to ${status}`,
            });
        }
    }
    catch (error) {
        console.error('Error toggling user status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error toggling user status',
        });
    }
});
exports.toggleUserStatus = toggleUserStatus;
const toggleUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // ID of the user to toggle status
    const { role } = req.query;
    if (typeof role !== 'string' || !['user', 'admin'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role',
        });
    }
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only admins can perform this action.',
            });
        }
        else {
            const userRef = firebase_1.firestore.collection('users').doc(userId);
            const userDoc = yield userRef.get();
            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            // Update user status
            yield userRef.update({ role });
            return res.status(200).json({
                success: true,
                message: `User role updated to ${role}`,
            });
        }
    }
    catch (error) {
        console.error('Error toggling user status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error toggling user status',
        });
    }
});
exports.toggleUserRole = toggleUserRole;
const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // ID of the user to delete
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only admins can perform this action.',
            });
        }
        else {
            const userRef = firebase_1.firestore.collection('users').doc(userId);
            const userDoc = yield userRef.get();
            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            // Delete user account
            yield userRef.delete();
            return res.status(200).json({
                success: true,
                message: 'User account deleted successfully',
            });
        }
    }
    catch (error) {
        console.error('Error deleting user account:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting user account',
        });
    }
});
exports.deleteUserAccount = deleteUserAccount;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId } = req.params;
    const currentUser = req.user;
    try {
        const userRef = firebase_1.firestore.collection('users').doc(userId);
        const userDoc = yield userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const user = userDoc.data();
        // If the current user is not an admin, ensure they are only accessing their own profile
        if (currentUser.role !== 'admin' && user.id !== currentUser.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this user',
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                "id": userDoc.id,
                "email": (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.email,
                "role": user.role,
                "status": (_b = userDoc.data()) === null || _b === void 0 ? void 0 : _b.account,
            },
        });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user',
        });
    }
});
exports.getSingleUser = getSingleUser;
