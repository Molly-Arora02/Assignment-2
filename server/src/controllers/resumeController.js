import StudentProfile from '../models/StudentProfile.js';
import Drive from '../models/Drive.js';
import { evaluateAndTailor, calculateATSScore, generateTailoredResume } from '../services/atsService.js';

// @desc    Analyze resume ATS score & tailor for a specific job drive with eligibility check
// @route   POST /api/resume/analyze-ats
// @access  Private (Student)
export const analyzeATSForDrive = async (req, res, next) => {
  try {
    const { driveId, resumeText } = req.body;

    if (!driveId) {
      return res.status(400).json({ success: false, message: 'Please select a target recruitment drive' });
    }

    const drive = await Drive.findById(driveId).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Target drive not found' });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      // Create fallback profile if missing
      profile = await StudentProfile.create({
        userId: req.user._id,
        rollNumber: '22CS1001',
        branch: 'CSE',
        CGPA: 8.0,
        graduationYear: 2026,
        activeBacklogs: 0,
        skills: ['JavaScript', 'Python', 'React', 'Data Structures', 'Git'],
      });
    }

    const result = await evaluateAndTailor(profile, drive, req.user, resumeText || '');

    res.status(200).json({
      success: true,
      data: {
        drive: {
          _id: drive._id,
          role: drive.role,
          type: drive.type,
          package: drive.package,
          packageLabel: drive.packageLabel,
          companyName: drive.companyId?.name || 'Corporate Partner',
          companyLogo: drive.companyId?.logo || '',
          location: drive.location,
          minCGPA: drive.minCGPA,
          eligibleBranches: drive.eligibleBranches,
          maxBacklogs: drive.maxBacklogs,
        },
        eligibility: result.eligibility,
        atsAnalysis: result.atsAnalysis,
        tailoredResume: result.tailoredResume,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply tailored skills and summary directly to student profile
// @route   POST /api/resume/apply-tailored
// @access  Private (Student)
export const applyTailoredToProfile = async (req, res, next) => {
  try {
    const { skills, resumeUrl } = req.body;

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    if (skills && Array.isArray(skills)) {
      profile.skills = [...new Set([...profile.skills, ...skills])];
    }
    if (resumeUrl) {
      profile.resumeUrl = resumeUrl;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Student profile updated with tailored skills successfully!',
      profile,
    });
  } catch (error) {
    next(error);
  }
};
