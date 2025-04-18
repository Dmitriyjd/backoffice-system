import express, { Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { isRoleAdmin } from './transaction.routes.js';

const router = express.Router();

const groupBySubType = async (matchStage: any) => {
    return await Transaction.aggregate([
        { $match: matchStage },
        { $group: { _id: '$subType', total: { $sum: '$amount' } } },
        { $project: { _id: 0, subType: '$_id', total: 1 } }
    ]);
};

router.get('/monthly', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const matchStage: any = { createdAt: { $gte: startOfMonth }, status: 'completed' };

        if (!isRoleAdmin(req.user?.role)) {
            matchStage.user = new mongoose.Types.ObjectId(req.user?._id);
        }

        const result = await groupBySubType(matchStage);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/weekly', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const matchStage: any = { createdAt: { $gte: startOfWeek }, status: 'completed' };

        if (!isRoleAdmin(req.user?.role)) {
            matchStage.user = new mongoose.Types.ObjectId(req.user?._id);
        }

        const result = await groupBySubType(matchStage);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
