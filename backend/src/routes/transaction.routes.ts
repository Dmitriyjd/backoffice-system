import express, { Response } from 'express';
import mongoose from 'mongoose';
import {authenticate, AuthenticatedRequest} from '../middleware/auth.middleware.js';
import Transaction from '../models/Transaction.js';
import { IRole } from '../models/Role.js';

const router = express.Router();

function isAdmin(role: IRole | mongoose.Types.ObjectId | undefined): boolean {
    return !!role && !mongoose.isValidObjectId(role) && (role as IRole).permissions.includes('manage_users');
}

export function isRoleAdmin(role: IRole | mongoose.Types.ObjectId | undefined): boolean {
    return !!role && !mongoose.isValidObjectId(role) && (role as IRole).permissions.includes('manage_users');
}

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { type, subType, amount, status, description, userId } = req.body;
        const admin = isAdmin(req.user?.role);
        const userToAssign = admin && userId ? userId : req.user?._id;
        const transaction = new Transaction({
            type,
            subType,
            amount,
            status,
            description,
            user: userToAssign
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const { page = 1, limit = 10, search = '', type, subType, status } = req.query;
        const query: any = {};

        if (type) query.type = type;
        if (subType) query.subType = subType;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } },
                { 'user.email': { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const user = req.user;

        if ((user?.role as IRole).name !== 'admin') {
            query.user = user?._id;
        }

        const total = await Transaction.countDocuments(query);

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('user', 'email');

        res.json({ transactions, total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('user');
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        const isOwner = transaction.user._id.toString() === req?.user?._id.toString();
        const isAdmin = (req?.user?.role as IRole)?.name === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
