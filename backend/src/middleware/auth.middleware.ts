import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { IUser } from '../models/User.js';
import { IRole } from '../models/Role.js';
import mongoose, { Types } from 'mongoose';

export interface AuthenticatedRequest extends Request {
    user?: IUser;
}

function hasPermissions(role: IRole | Types.ObjectId | undefined, perms: string[]): boolean {
    if (!role || mongoose.isValidObjectId(role)) return false;
    const r = role as IRole;
    return perms.some(p => r.permissions.includes(p));
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await User.findById(decoded.id).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

export const authorize = (permissions: string[] = []) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!permissions.length || hasPermissions(req.user?.role, permissions)) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden' });
    };
};
