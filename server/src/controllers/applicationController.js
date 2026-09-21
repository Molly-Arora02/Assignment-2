import Application from '../models/Application.js';
import Drive from '../models/Drive.js';
import StudentProfile from '../models/StudentProfile.js';
import PlacementRecord from '../models/PlacementRecord.js';
import { checkStudentEligibility } from '../services/eligibilityService.js';
import { checkPlacementPolicy } from '../services/policyService.js';

// @desc    Apply to a recruitment drive (with automated eligibility & policy enforcement)
// @route   POST /api/drives/:id/apply
// @access  Private (Student)
export const applyToDrive = async (req, res, next) => {
  try {
    const driveId = req.params.id;
    const studentUserId = req.user._id;

    // 1. Fetch Drive & Student Profile
    const drive = await Drive.findById(driveId).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Recruitment drive not found' });
    }

    const studentProfile = await StudentProfile.findOne({ userId: studentUserId });
    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: 'Student profile not found. Please complete your academic profile before applying.',
      });
    }

    // 2. Check if student already applied
    const existingApplication = await Application.findOne({
      studentId: studentUserId,
      driveId: drive._id,
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this recruitment drive.',
      });
    }

    // 3. Server-side Automated Eligibility Validation
    const eligibility = checkStudentEligibility(studentProfile, drive);
    if (!eligibility.isEligible) {
      return res.status(403).json({
        success: false,
        message: `Application rejected: You do not meet the eligibility criteria for this drive. Reasons: ${eligibility.reasons.join(
          '; '
        )}`,
        reasons: eligibility.reasons,
        details: eligibility.details,
      });
    }

    // 4. Server-side Placement Policy Enforcement
    const policyCheck = await checkPlacementPolicy(studentUserId, drive);
    if (!policyCheck.isAllowed) {
      return res.status(403).json({
        success: false,
        message: policyCheck.reason,
      });
    }

    // 5. Create Application document with initial audit history
    const application = await Application.create({
      studentId: studentUserId,
      studentProfileId: studentProfile._id,
      driveId: drive._id,
      companyId: drive.companyId._id,
      status: 'Applied',
      appliedAt: new Date(),
      applicantSnapshot: {
        CGPA: studentProfile.CGPA,
        branch: studentProfile.branch,
        activeBacklogs: studentProfile.activeBacklogs,
        graduationYear: studentProfile.graduationYear,
        resumeUrl: studentProfile.resumeUrl,
        skills: studentProfile.skills,
      },
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: studentUserId,
          role: 'student',
          timestamp: new Date(),
          notes: 'Application submitted successfully',
        },
      ],
    });

    const populatedApp = await Application.findById(application._id)
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' },
      })
      .populate('studentId', 'name email');

    res.status(201).json({
      success: true,
      message: `Successfully applied for ${drive.role} at ${drive.companyId.name}!`,
      application: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by current student
// @route   GET /api/applications/me
// @access  Private (Student)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' },
      })
      .populate('companyId')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applicants for a specific drive
// @route   GET /api/applications/drive/:driveId
// @access  Private (Recruiter of this drive, Admin)
export const getDriveApplicants = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const drive = await Drive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    // Recruiter permission guard
    if (req.user.role === 'recruiter') {
      if (!req.user.companyId || drive.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You are not authorized to view applicants for this company.',
        });
      }
    }

    const { status, branch, search } = req.query;
    const query = { driveId };

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('studentId', 'name email')
      .populate('studentProfileId')
      .populate('driveId')
      .sort({ appliedAt: -1 });

    // Optional in-memory filter for candidate name/branch if query given
    let filtered = applications;
    if (branch) {
      filtered = filtered.filter(
        (app) => app.studentProfileId?.branch?.toLowerCase() === branch.toLowerCase()
      );
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.studentId?.name?.toLowerCase().includes(s) ||
          app.studentId?.email?.toLowerCase().includes(s) ||
          app.studentProfileId?.rollNumber?.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      drive,
      applications: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Recruitment Pipeline)
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter, Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('driveId')
      .populate('studentProfileId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Role check: Recruiters can only modify applications for their company drives
    if (req.user.role === 'recruiter') {
      if (
        !req.user.companyId ||
        application.driveId.companyId.toString() !== req.user.companyId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot modify candidates for another company.',
        });
      }
    }

    // Prevent student from calling this endpoint (already protected by role middleware)
    if (req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Students are not allowed to update application status.',
      });
    }

    // Record state change into history
    application.status = status;
    application.statusHistory.push({
      status,
      updatedBy: req.user._id,
      role: req.user.role,
      timestamp: new Date(),
      notes: notes || `Status updated to ${status} by ${req.user.name} (${req.user.role})`,
    });

    await application.save();

    // If candidate is SELECTED:
    if (status === 'Selected') {
      // 1. Mark student profile as placed
      await StudentProfile.findOneAndUpdate(
        { userId: application.studentId },
        {
          isPlaced: true,
          placedCompanyId: application.companyId,
          placedPackage: application.driveId.package,
        }
      );

      // 2. Create or update Placement Record
      await PlacementRecord.findOneAndUpdate(
        { applicationId: application._id },
        {
          studentId: application.studentId,
          studentProfileId: application.studentProfileId?._id,
          companyId: application.companyId,
          driveId: application.driveId._id,
          applicationId: application._id,
          role: application.driveId.role,
          package: application.driveId.package,
          placementType: application.driveId.type,
          academicYear: '2025-2026',
          verifiedBy: req.user._id,
        },
        { upsert: true, new: true }
      );
    }

    const updated = await Application.findById(application._id)
      .populate('studentId', 'name email')
      .populate('studentProfileId')
      .populate('driveId');

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}' successfully`,
      application: updated,
    });
  } catch (error) {
    next(error);
  }
};
