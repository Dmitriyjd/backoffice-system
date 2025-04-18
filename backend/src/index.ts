import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import revenueRoutes from './routes/revenue.routes.js';
import { authenticate } from './middleware/auth.middleware.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/transactions', authenticate, transactionRoutes);
app.use('/api/revenue', authenticate, revenueRoutes);

const PORT = 5000;
mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error('❌ MongoDB error:', err));