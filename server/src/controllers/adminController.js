import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import PlacementRecord from '../models/PlacementRecord.js';
import Company from '../models/Company.js';
import Setting from '../models/Setting.js';

// @desc    Get complete institutional placement analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const placedStudents = await StudentProfile.countDocuments({ isPlaced: true });
    const totalDrives = await Drive.countDocuments();
    const activeDrives = await Drive.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    const placementPercentage =
      totalStudents > 0 ? Number(((placedStudents / totalStudents) * 100).toFixed(1)) : 0;

    // CTC Metrics
    const placementRecords = await PlacementRecord.find();
    let highestPackage = 0;
    let totalPackageSum = 0;

    placementRecords.forEach((rec) => {
      if (rec.package > highestPackage) highestPackage = rec.package;
      totalPackageSum += rec.package;
    });

    const averagePackage =
      placementRecords.length > 0
        ? Number((totalPackageSum / placementRecords.length).toFixed(2))
        : 0;

    // Branch-wise Breakdown
    const branches = ['CSE', 'IT', 'AI/ML', 'ECE', 'EE', 'ME', 'CE', 'AIDS'];
    const branchStats = await Promise.all(
      branches.map(async (branch) => {
        const totalInBranch = await StudentProfile.countDocuments({ branch });
        const placedInBranch = await StudentProfile.countDocuments({
          branch,
          isPlaced: true,
        });
        const branchRate =
          totalInBranch > 0
            ? Number(((placedInBranch / totalInBranch) * 100).toFixed(1))
            : 0;

        return {
          branch,
          total: totalInBranch,
          placed: placedInBranch,
          unplaced: totalInBranch - placedInBranch,
          rate: branchRate,
        };
      })
    );

    // Filter out branches with 0 students if needed, or keep all
    const activeBranchStats = branchStats.filter((b) => b.total > 0);

    // Application Funnel Stats
    const funnelStages = ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'];
    const funnelStats = await Promise.all(
      funnelStages.map(async (status) => {
        const count = await Application.countDocuments({ status });
        return { stage: status, count };
      })
    );

    // Company-wise Hires
    const companyRecords = await PlacementRecord.find().populate('companyId', 'name');
    const companyHiresMap = {};

    companyRecords.forEach((rec) => {
      const compName = rec.companyId?.name || 'Other';
      if (!companyHiresMap[compName]) {
        companyHiresMap[compName] = { company: compName, hires: 0, highestCTC: 0 };
      }
      companyHiresMap[compName].hires += 1;
      if (rec.package > companyHiresMap[compName].highestCTC) {
        companyHiresMap[compName].highestCTC = rec.package;
      }
    });

    const companyStats = Object.values(companyHiresMap);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalStudents,
          placedStudents,
          unplacedStudents: totalStudents - placedStudents,
          placementPercentage,
          highestPackage,
          averagePackage,
          totalDrives,
          activeDrives,
          totalApplications,
          totalCompanies,
        },
        branchStats: activeBranchStats.length > 0 ? activeBranchStats : branchStats.slice(0, 5),
        funnelStats,
        companyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with profile & placement details
// @route   GET /api/admin/students
// @access  Private (Admin)
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await StudentProfile.find()
      .populate('userId', 'name email role')
      .populate('placedCompanyId', 'name')
      .sort({ CGPA: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all placement records
// @route   GET /api/admin/placement-records
// @access  Private (Admin)
export const getPlacementRecords = async (req, res, next) => {
  try {
    const records = await PlacementRecord.find()
      .populate('studentId', 'name email')
      .populate('studentProfileId')
      .populate('companyId', 'name logo')
      .populate('driveId', 'role package type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export placement report to CSV format
// @route   GET /api/admin/export-csv
// @access  Private (Admin)
export const exportPlacementCSV = async (req, res, next) => {
  try {
    const records = await PlacementRecord.find()
      .populate('studentId', 'name email')
      .populate('studentProfileId')
      .populate('companyId', 'name')
      .populate('driveId', 'role package type');

    const csvHeaders =
      'Roll Number,Student Name,Email,Branch,CGPA,Company,Role,Package (LPA),Placement Type,Date\n';

    const csvRows = records.map((rec) => {
      const roll = rec.studentProfileId?.rollNumber || 'N/A';
      const name = `"${rec.studentId?.name || 'N/A'}"`;
      const email = rec.studentId?.email || 'N/A';
      const branch = rec.studentProfileId?.branch || 'N/A';
      const cgpa = rec.studentProfileId?.CGPA || 'N/A';
      const company = `"${rec.companyId?.name || 'N/A'}"`;
      const role = `"${rec.role || 'N/A'}"`;
      const pkg = rec.package || 0;
      const type = rec.placementType || 'Placement';
      const date = new Date(rec.createdAt).toLocaleDateString();

      return `${roll},${name},email,${branch},${cgpa},${company},${role},${pkg},${type},${date}`;
    });

    const csvContent = csvHeaders + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="campusconnect_placement_report.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Get institutional placement policy settings
// @route   GET /api/admin/policy
// @access  Private (Admin)
export const getPolicySettings = async (req, res, next) => {
  try {
    let setting = await Setting.findOne({ key: 'oneOfferPolicy' });
    if (!setting) {
      setting = await Setting.create({
        key: 'oneOfferPolicy',
        value: {
          enabled: true,
          allowDreamUpgrade: true,
          dreamMultiplier: 1.5,
          maxBacklogsAllowedInstitutionWide: 2,
        },
        description: 'Single-offer restriction policy',
      });
    }

    res.status(200).json({
      success: true,
      policy: setting.value,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update institutional placement policy settings
// @route   PUT /api/admin/policy
// @access  Private (Admin)
export const updatePolicySettings = async (req, res, next) => {
  try {
    const { enabled, allowDreamUpgrade, dreamMultiplier, maxBacklogsAllowedInstitutionWide } =
      req.body;

    let setting = await Setting.findOne({ key: 'oneOfferPolicy' });

    if (!setting) {
      setting = new Setting({ key: 'oneOfferPolicy' });
    }

    setting.value = {
      enabled: enabled !== undefined ? Boolean(enabled) : setting.value?.enabled ?? true,
      allowDreamUpgrade:
        allowDreamUpgrade !== undefined
          ? Boolean(allowDreamUpgrade)
          : setting.value?.allowDreamUpgrade ?? true,
      dreamMultiplier: dreamMultiplier ? Number(dreamMultiplier) : setting.value?.dreamMultiplier ?? 1.5,
      maxBacklogsAllowedInstitutionWide:
        maxBacklogsAllowedInstitutionWide !== undefined
          ? Number(maxBacklogsAllowedInstitutionWide)
          : setting.value?.maxBacklogsAllowedInstitutionWide ?? 2,
    };

    await setting.save();

    res.status(200).json({
      success: true,
      message: 'Placement policy settings updated successfully',
      policy: setting.value,
    });
  } catch (error) {
    next(error);
  }
};
