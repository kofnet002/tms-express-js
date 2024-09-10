import { User } from "../models/user";
import { firestore } from "../services/firebase";
import { AuthenticatedRequest } from "../types/request";
import { Response, Request } from "express";


export const toggleUserStatus = async (req: AuthenticatedRequest, res: Response) => {
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
        } else {
            const userRef = firestore.collection('users').doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Update user status
            await userRef.update({ status });

            return res.status(200).json({
                success: true,
                message: `User status updated to ${status}`,
            });
        }

    } catch (error) {
        console.error('Error toggling user status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error toggling user status',
        });
    }
};

export const toggleUserRole = async (req: AuthenticatedRequest, res: Response) => {
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
        } else {
            const userRef = firestore.collection('users').doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Update user status
            await userRef.update({ role });

            return res.status(200).json({
                success: true,
                message: `User role updated to ${role}`,
            });
        }

    } catch (error) {
        console.error('Error toggling user status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error toggling user status',
        });
    }
};

export const deleteUserAccount = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params; // ID of the user to delete

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only admins can perform this action.',
            });
        } else {
            const userRef = firestore.collection('users').doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Delete user account
            await userRef.delete();

            return res.status(200).json({
                success: true,
                message: 'User account deleted successfully',
            });
        }
    } catch (error) {
        console.error('Error deleting user account:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting user account',
        });
    }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
    const currentUser: User = req.user;

    try {
        const userRef = firestore.collection('users');
        const userDoc = await userRef.get();


        // If the current user is not an admin
        if (currentUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this endpoint',
            });
        }

        const users = userDoc.docs.map((doc) => ({
            "id": doc.id,
            "email": doc.data().email,
            "role": doc.data().role,
            "status": doc.data().account,
        }));

        const total_users = users.length;

        return res.status(200).json({
            success: true,
            data: {
                total_users,
                users,
            },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user',
        });
    }
};

export const getSingleUser = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params;
    const currentUser: User = req.user;

    try {
        const userRef = firestore.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const user = userDoc.data() as User;

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
                "email": userDoc.data()?.email,
                "role": user.role,
                "status": userDoc.data()?.account,
            },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user',
        });
    }
};
