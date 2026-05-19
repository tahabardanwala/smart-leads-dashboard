import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middlewares/auth';
import { LeadStatus, UserRole } from '../types';
import { asyncHandler } from '../utils/errorHandler';
import { AppError } from '../utils/AppError';

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, status, source } = req.body;

  if (!name || !email || !source) {
    throw new AppError('Name, email, and source are required', 400);
  }

  const lead = await Lead.create({
    name,
    email,
    status: status || LeadStatus.NEW,
    source,
    createdBy: req.user?.id
  });

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead
  });
});

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, source, search, sort, page = '1', limit = '10' } = req.query;
  
  const query: any = {};
  
  if (status) query.status = status;
  if (source) query.source = source;
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(query)
  ]);

  res.json({
    success: true,
    message: 'Leads fetched successfully',
    data: leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const getLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
  
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  res.json({
    success: true,
    message: 'Lead fetched successfully',
    data: lead
  });
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  res.json({
    success: true,
    message: 'Lead updated successfully',
    data: lead
  });
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  res.json({
    success: true,
    message: 'Lead deleted successfully',
    data: null
  });
});

export const exportCSV = asyncHandler(async (req: AuthRequest, res: Response) => {
  const leads = await Lead.find({}).sort({ createdAt: -1 });
  
  let csv = 'Name,Email,Status,Source,Created At\n';
  leads.forEach(lead => {
    csv += `"${lead.name}","${lead.email}","${lead.status}","${lead.source}","${lead.createdAt}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.status(200).send(csv);
});
