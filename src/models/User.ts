import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserRole } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.SALES 
  }
}, { timestamps: true });

export default mongoose.model<IUserDocument>('User', UserSchema);
