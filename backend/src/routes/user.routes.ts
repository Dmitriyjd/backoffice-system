import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { authorize, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authorize(['manage_users']));

router.get('/', async (_req, res) => {
    const users = await User.find().populate('role');
    res.json(users);
});

router.get('/:id', async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

router.post('/', async (req: Request, res: Response) => {
    const { name, email, password, roleName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ name: roleName });
        if (!role) return res.status(400).json({ message: 'Role not found' });
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json(user);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const { name, email, roleName } = req.body;
    try {
        const role = await Role.findOne({ name: roleName });
        if (!role) return res.status(400).json({ message: 'Role not found' });
        const user = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
