import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user';
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({
        success: false,
        message: 'Authorization credentials were not provided'
    });

    try {
        const decoded = jwt.verify(token, SECRET!);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export const authorize = (role: 'user' | 'admin') => (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) return res.status(403).json({ message: 'Access forbidden' });
    next();
};
