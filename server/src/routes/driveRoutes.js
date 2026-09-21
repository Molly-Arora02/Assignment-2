import express from 'express';
import {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
} from '../controllers/driveController.js';
import { applyToDrive } from '../controllers/applicationController.js';
import { protect, authorize, JWT_SECRET } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional auth middleware: extracts user if token present, but doesn't block if missing
const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token decode errors for public access
    }
  }
  next();
};

router.get('/', optionalProtect, getDrives);
router.get('/:id', optionalProtect, getDriveById);
router.post('/:id/apply', protect, authorize('student'), applyToDrive);
router.post('/', protect, authorize('admin', 'recruiter'), createDrive);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateDrive);
router.delete('/:id', protect, authorize('admin'), deleteDrive);

export default router;
