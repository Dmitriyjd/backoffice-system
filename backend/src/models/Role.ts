import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
    name: string;
    permissions: string[];
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true },
    permissions: [{ type: String }]
});

export default mongoose.model<IRole>('Role', roleSchema);
