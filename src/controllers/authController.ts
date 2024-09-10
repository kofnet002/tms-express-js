import { Request, Response } from 'express';
import { firestore } from '../services/firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    if (!email || !password) return res.status(400).json({
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { email, password: hashedPassword, role: role || 'user', accout: 'active' };

    const userRef = firestore.collection('users').doc();
    await userRef.set(newUser);

    return res.status(201).json({
        success: true,
        message: 'User registered successfully'
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userQuery = await firestore.collection('users').where('email', '==', email).get();
    if (userQuery.empty) return res.status(404).json({
        success: false,
        message: 'User not found'
    });

    const user = userQuery.docs[0].data();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
    });

    const token = jwt.sign({ id: userQuery.docs[0].id, role: user.role }, SECRET!, {
        expiresIn: '1h',
    });

    return res.status(200).json({
        success: true,
        token
    });
};
