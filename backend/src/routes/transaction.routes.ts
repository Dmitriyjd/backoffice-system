import express, { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
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

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { type, subType, status, minAmount, maxAmount, search, page = '1', limit = '10', userId } = req.query;
        const query: any = {};

        const admin = isAdmin(req.user?.role);
        if (!admin) {
            query.user = req.user?._id;
        } else if (userId) {
            query.user = userId;
        }
        if (type) query.type = type;
        if (subType) query.subType = subType;
        if (status) query.status = status;
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = Number(minAmount);
            if (maxAmount) query.amount.$lte = Number(maxAmount);
        }
        if (search) {
            query.description = new RegExp(search.toString(), 'i');
        }

        const transactions = await Transaction.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);

        const count = await Transaction.countDocuments(query);
        res.json({ data: transactions, total: count });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('user', 'name email');
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        const isOwner = transaction.user._id.equals(req.user?._id);
        const admin = isAdmin(req.user?.role);
        if (!isOwner && !admin) return res.status(403).json({ message: 'Forbidden' });

        res.json(transaction);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
