import express from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead, exportCSV } from '../controllers/leadController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../types';

const router = express.Router();

router.use(authenticate);

router.get('/', getLeads);
router.post('/', createLead);
router.get('/export', authorize([UserRole.ADMIN]), exportCSV);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', authorize([UserRole.ADMIN]), deleteLead);

export default router;
