import mongoose, { Document, Schema, Types } from 'mongoose';
import { IRole } from './Role.js';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Types.ObjectId | IRole;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
});

export default mongoose.model<IUser>('User', userSchema);
