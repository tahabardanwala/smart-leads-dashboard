import mongoose, { Schema, Document } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../types';

export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(LeadStatus), 
    default: LeadStatus.NEW 
  },
  source: { 
    type: String, 
    enum: Object.values(LeadSource), 
    required: true 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Indexing for search
LeadSchema.index({ name: 'text', email: 'text' });

export default mongoose.model<ILeadDocument>('Lead', LeadSchema);
