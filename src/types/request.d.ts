import { Request } from 'express';
import { User } from '../models/user';

// Extend the Request interface to include the user
export interface AuthenticatedRequest extends Request {
    user: User;
}
