import express from 'express';
import {
  applyToDrive,
  getMyApplications,
  getDriveApplicants,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/drive/:id/apply', protect, authorize('student'), applyToDrive);
router.post('/:id/apply', protect, authorize('student'), applyToDrive);
router.get('/me', protect, authorize('student'), getMyApplications);
router.get('/drive/:driveId', protect, authorize('recruiter', 'admin'), getDriveApplicants);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

export default router;
