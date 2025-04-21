import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const { password, ...safeUser } = req.user.toObject();
        res.json(safeUser);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password, roleName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ name: roleName }) || await Role.findOne({ name: 'user' });
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
        res.status(201).json({ token });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('role');

        if (!user) {
            console.log('⛔ User not found:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('💡 Password provided:', password);
        console.log('💡 Stored hash:', user?.password);
        const isMatch = await bcrypt.compare(password, user?.password);
        console.log('✅ bcrypt.compare result:', isMatch);

        if (!isMatch) {
            console.log('⛔ Password mismatch for:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
        res.json({ token });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
