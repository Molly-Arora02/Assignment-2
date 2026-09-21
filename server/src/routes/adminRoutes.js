import express from 'express';
import {
  getAnalytics,
  getAllStudents,
  getPlacementRecords,
  exportPlacementCSV,
  getPolicySettings,
  updatePolicySettings,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/students', getAllStudents);
router.get('/placement-records', getPlacementRecords);
router.get('/export-csv', exportPlacementCSV);
router.get('/policy', getPolicySettings);
router.put('/policy', updatePolicySettings);

export default router;
