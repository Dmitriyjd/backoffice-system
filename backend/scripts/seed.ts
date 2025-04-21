import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Role from '../src/models/Role.js';
import User from '../src/models/User.js';
import Transaction from '../src/models/Transaction.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Connected to MongoDB');

        await Role.deleteMany({});
        await User.deleteMany({});
        await Transaction.deleteMany({});

        const adminRole = new Role({
            name: 'admin',
            permissions: ['manage_users', 'view_transactions']
        });

        const userRole = new Role({
            name: 'user',
            permissions: ['view_transactions']
        });

        await adminRole.save();
        await userRole.save();

        const adminPassword = await bcrypt.hash('adminPassword123', 10);
        const userPassword = await bcrypt.hash('userPassword123', 10);

        const admin = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: adminRole._id
        });

        const user = new User({
            name: 'User',
            email: 'user@example.com',
            password: userPassword,
            role: userRole._id
        });

        await admin.save();
        await user.save();

        const transactions = [
            {
                type: 'deposit',
                subType: 'reward',
                amount: 100,
                status: 'completed',
                description: 'Welcome reward',
                user: user._id
            },
            {
                type: 'credit',
                subType: 'purchase',
                amount: 50,
                status: 'completed',
                description: 'Bought something',
                user: user._id
            },
            {
                type: 'credit',
                subType: 'refund',
                amount: 20,
                status: 'pending',
                description: 'Refund in progress',
                user: user._id
            }
        ];

        await Transaction.insertMany(transactions);

        console.log('🌱 Seed completed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error', err);
        process.exit(1);
    }
};

seed();
