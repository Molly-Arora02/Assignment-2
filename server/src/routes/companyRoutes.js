import express from 'express';
import { getCompanies, createCompany } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCompanies);
router.post('/', protect, authorize('admin'), createCompany);

export default router;
