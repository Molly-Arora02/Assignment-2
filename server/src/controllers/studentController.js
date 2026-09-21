import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

// @desc    Get current student's profile
// @route   GET /api/students/me
// @access  Private (Student)
export const getMyProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email role')
      .populate('placedCompanyId');

    if (!profile) {
      // Auto-create blank profile if not yet created
      profile = await StudentProfile.create({
        userId: req.user._id,
        rollNumber: `22CS${Math.floor(1000 + Math.random() * 9000)}`,
        branch: 'CSE',
        CGPA: 7.5,
        graduationYear: 2026,
        activeBacklogs: 0,
      });
      profile = await StudentProfile.findById(profile._id).populate('userId', 'name email role');
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student's profile
// @route   PUT /api/students/me
// @access  Private (Student)
export const updateMyProfile = async (req, res, next) => {
  try {
    const {
      rollNumber,
      branch,
      CGPA,
      skills,
      resumeUrl,
      graduationYear,
      activeBacklogs,
      phone,
      name,
    } = req.body;

    // Optional: update name in User document
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    if (rollNumber !== undefined) profile.rollNumber = rollNumber;
    if (branch !== undefined) profile.branch = branch;
    if (CGPA !== undefined) profile.CGPA = Number(CGPA);
    if (skills !== undefined) {
      profile.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (graduationYear !== undefined) profile.graduationYear = Number(graduationYear);
    if (activeBacklogs !== undefined) profile.activeBacklogs = Number(activeBacklogs);
    if (phone !== undefined) profile.phone = phone;

    await profile.save();

    const updatedProfile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email role')
      .populate('placedCompanyId');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};
