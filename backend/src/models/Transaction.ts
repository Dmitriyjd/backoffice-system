import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User.js';

export interface ITransaction extends Document {
    type: 'deposit' | 'credit';
    subType: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    description: string;
    user: Types.ObjectId | IUser;
    createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
    type: { type: String, enum: ['deposit', 'credit'], required: true },
    subType: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
