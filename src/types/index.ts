export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  LOST = 'lost'
}

export enum LeadSource {
  WEBSITE = 'website',
  INSTAGRAM = 'instagram',
  REFERRAL = 'referral'
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: string | Date;
}

export interface ILead {
  _id?: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string; // User ID
  createdAt?: string | Date;
}

export interface AuthResponse {
  token: string;
  user: IUser;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
