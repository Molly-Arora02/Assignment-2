import express from 'express';
import { analyzeATSForDrive, applyTailoredToProfile } from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze-ats', protect, authorize('student'), analyzeATSForDrive);
router.post('/apply-tailored', protect, authorize('student'), applyTailoredToProfile);

export default router;
