import Drive from '../models/Drive.js';
import Company from '../models/Company.js';
import StudentProfile from '../models/StudentProfile.js';
import Application from '../models/Application.js';
import { checkStudentEligibility } from '../services/eligibilityService.js';
import { checkPlacementPolicy } from '../services/policyService.js';

// @desc    Get all recruitment drives with filters & student eligibility calculations
// @route   GET /api/drives
// @access  Public / Authenticated
export const getDrives = async (req, res, next) => {
  try {
    const { search, type, branch, status, sort } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    } else {
      // By default show active drives for students/public
      if (!req.user || req.user.role === 'student') {
        query.status = 'Active';
      }
    }

    if (type) {
      query.type = type;
    }

    if (branch) {
      query.eligibleBranches = { $in: [branch] };
    }

    if (search) {
      query.$or = [
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // If logged in as recruiter, only show their company drives (unless admin)
    if (req.user && req.user.role === 'recruiter' && req.user.companyId) {
      query.companyId = req.user.companyId;
    }

    let driveQuery = Drive.find(query).populate('companyId').populate('createdBy', 'name email');

    if (sort === 'package_high') {
      driveQuery = driveQuery.sort({ package: -1 });
    } else if (sort === 'deadline_soon') {
      driveQuery = driveQuery.sort({ deadline: 1 });
    } else {
      driveQuery = driveQuery.sort({ createdAt: -1 });
    }

    const drives = await driveQuery.exec();

    // If authenticated student, attach real-time eligibility evaluation & application status to each drive
    if (req.user && req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
      const userApplications = await Application.find({ studentId: req.user._id });

      const applicationMap = new Map(
        userApplications.map((app) => [app.driveId.toString(), app])
      );

      const enrichedDrives = await Promise.all(
        drives.map(async (drive) => {
          const driveObj = drive.toObject();
          const eligibility = checkStudentEligibility(studentProfile, drive);
          const policyCheck = await checkPlacementPolicy(req.user._id, drive);

          const existingApp = applicationMap.get(drive._id.toString());

          return {
            ...driveObj,
            isEligible: eligibility.isEligible && policyCheck.isAllowed,
            eligibilityReasons: [
              ...eligibility.reasons,
              ...(policyCheck.isAllowed ? [] : [policyCheck.reason]),
            ],
            eligibilityDetails: eligibility.details,
            hasApplied: Boolean(existingApp),
            applicationId: existingApp ? existingApp._id : null,
            applicationStatus: existingApp ? existingApp.status : null,
          };
        })
      );

      return res.status(200).json({
        success: true,
        count: enrichedDrives.length,
        drives: enrichedDrives,
      });
    }

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single drive by ID
// @route   GET /api/drives/:id
// @access  Public / Authenticated
export const getDriveById = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('companyId')
      .populate('createdBy', 'name email');

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Recruitment drive not found' });
    }

    const driveObj = drive.toObject();

    // If student, compute eligibility and application status
    if (req.user && req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
      const existingApp = await Application.findOne({
        studentId: req.user._id,
        driveId: drive._id,
      });

      const eligibility = checkStudentEligibility(studentProfile, drive);
      const policyCheck = await checkPlacementPolicy(req.user._id, drive);

      driveObj.isEligible = eligibility.isEligible && policyCheck.isAllowed;
      driveObj.eligibilityReasons = [
        ...eligibility.reasons,
        ...(policyCheck.isAllowed ? [] : [policyCheck.reason]),
      ];
      driveObj.eligibilityDetails = eligibility.details;
      driveObj.hasApplied = Boolean(existingApp);
      driveObj.application = existingApp;
    }

    res.status(200).json({
      success: true,
      drive: driveObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new recruitment drive
// @route   POST /api/drives
// @access  Private (Admin, Recruiter for their company)
export const createDrive = async (req, res, next) => {
  try {
    let {
      companyId,
      role,
      type,
      package: packageValue,
      packageLabel,
      description,
      location,
      minCGPA,
      eligibleBranches,
      maxBacklogs,
      eligibleYears,
      deadline,
      status,
    } = req.body;

    // Recruiter authorization rule: Recruiter can only create drive for their assigned company
    if (req.user.role === 'recruiter') {
      if (!req.user.companyId) {
        return res.status(403).json({
          success: false,
          message: 'Recruiter account is not associated with any company',
        });
      }
      companyId = req.user.companyId;
    }

    if (!companyId) {
      return res.status(400).json({ success: false, message: 'Company ID is required' });
    }

    const drive = await Drive.create({
      companyId,
      role,
      type: type || 'Placement',
      package: Number(packageValue),
      packageLabel: packageLabel || `₹${packageValue} LPA`,
      description,
      location: location || 'Bangalore / Remote',
      minCGPA: minCGPA !== undefined ? Number(minCGPA) : 6.0,
      eligibleBranches: eligibleBranches || ['CSE', 'IT', 'AI/ML', 'ECE'],
      maxBacklogs: maxBacklogs !== undefined ? Number(maxBacklogs) : 0,
      eligibleYears: eligibleYears || [2026],
      deadline: deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      status: status || 'Active',
      createdBy: req.user._id,
    });

    const populatedDrive = await Drive.findById(drive._id).populate('companyId');

    res.status(201).json({
      success: true,
      message: 'Drive created successfully',
      drive: populatedDrive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruitment drive
// @route   PUT /api/drives/:id
// @access  Private (Admin, Recruiter for their company)
export const updateDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    // Recruiter permission guard
    if (req.user.role === 'recruiter') {
      if (!req.user.companyId || drive.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only update recruitment drives for your own company.',
        });
      }
    }

    const updatedDrive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('companyId');

    res.status(200).json({
      success: true,
      message: 'Drive updated successfully',
      drive: updatedDrive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recruitment drive
// @route   DELETE /api/drives/:id
// @access  Private (Admin)
export const deleteDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    await Drive.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ driveId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Drive and associated applications removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
