/**
 * Automatic Eligibility Validation Engine
 * Evaluates a student profile against drive requirements.
 */
export const checkStudentEligibility = (studentProfile, drive) => {
  const reasons = [];

  if (!studentProfile) {
    return {
      isEligible: false,
      reasons: ['Student profile is incomplete. Please complete your profile first.'],
      details: {},
    };
  }

  // 1. CGPA Criterion
  const minCGPA = drive.minCGPA ?? 0;
  const studentCGPA = Number(studentProfile.CGPA || 0);
  const meetsCGPA = studentCGPA >= minCGPA;
  if (!meetsCGPA) {
    reasons.push(`Minimum CGPA requirement is ${minCGPA} (Your CGPA: ${studentCGPA})`);
  }

  // 2. Branch Criterion
  const eligibleBranches = drive.eligibleBranches || [];
  const meetsBranch =
    eligibleBranches.length === 0 ||
    eligibleBranches.map((b) => b.toUpperCase()).includes((studentProfile.branch || '').toUpperCase());
  if (!meetsBranch) {
    reasons.push(
      `Eligible branches: ${eligibleBranches.join(', ')} (Your branch: ${studentProfile.branch || 'N/A'})`
    );
  }

  // 3. Backlog Criterion
  const maxBacklogs = drive.maxBacklogs ?? 0;
  const studentBacklogs = Number(studentProfile.activeBacklogs || 0);
  const meetsBacklogs = studentBacklogs <= maxBacklogs;
  if (!meetsBacklogs) {
    reasons.push(
      `Allowed active backlogs: maximum ${maxBacklogs} (You currently have: ${studentBacklogs})`
    );
  }

  // 4. Graduation Year Criterion
  const eligibleYears = drive.eligibleYears || [];
  const studentYear = Number(studentProfile.graduationYear || 0);
  const meetsYear =
    eligibleYears.length === 0 || eligibleYears.includes(studentYear);
  if (!meetsYear) {
    reasons.push(
      `Eligible graduation batches: ${eligibleYears.join(', ')} (Your batch: ${studentYear})`
    );
  }

  // 5. Drive Status & Deadline
  const isDriveActive = drive.status === 'Active';
  const isDeadlinePassed = new Date(drive.deadline) < new Date();
  if (!isDriveActive) {
    reasons.push(`Recruitment drive is currently ${drive.status.toLowerCase()}.`);
  }
  if (isDeadlinePassed) {
    reasons.push('Application deadline has passed.');
  }

  const isEligible =
    meetsCGPA &&
    meetsBranch &&
    meetsBacklogs &&
    meetsYear &&
    isDriveActive &&
    !isDeadlinePassed;

  return {
    isEligible,
    reasons,
    details: {
      meetsCGPA,
      meetsBranch,
      meetsBacklogs,
      meetsYear,
      isDriveActive,
      isDeadlinePassed,
      studentCGPA,
      requiredCGPA: minCGPA,
      studentBranch: studentProfile.branch,
      eligibleBranches,
      studentBacklogs,
      maxAllowedBacklogs: maxBacklogs,
      studentYear,
      eligibleYears,
    },
  };
};
