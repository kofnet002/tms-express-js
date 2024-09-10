import express, { Response } from 'express';
import { toggleUserStatus, deleteUserAccount, toggleUserRole, getSingleUser, getUsers } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get a single user
router.get('/user/:userId', authenticate, async (req: any, res: Response) => {
    await getSingleUser(req, res);
});

// Get a single user
router.get('/users', authenticate, async (req: any, res: Response) => {
    await getUsers(req, res);
});

// Toggle user status (active/inactive)
router.put('/user/:userId/toggle-status', authenticate, async (req: any, res: Response) => {
    await toggleUserStatus(req, res);
});

// Toggle user role (admin/user)
router.put('/user/:userId/toggle-role', authenticate, async (req: any, res: Response) => {
    await toggleUserRole(req, res);
});

// Delete user account
router.delete('/user/:userId', authenticate, async (req: any, res: Response) => {
    await deleteUserAccount(req, res);
});

export default router;
