import Setting from '../models/Setting.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';

/**
 * Campus Placement Policy Validator
 * Checks whether institution placement policy permits a student to apply.
 */
export const checkPlacementPolicy = async (studentUserId, drive) => {
  // Fetch campus policy settings (default: 1-Offer Policy enabled)
  let policySetting = await Setting.findOne({ key: 'oneOfferPolicy' });
  const isOneOfferPolicyActive = policySetting ? policySetting.value.enabled : true;

  if (!isOneOfferPolicyActive) {
    return { isAllowed: true, reason: null };
  }

  // Check if student is already selected for any previous Placement drive
  const selectedApplications = await Application.find({
    studentId: studentUserId,
    status: 'Selected',
  }).populate('driveId');

  const selectedPlacementOffer = selectedApplications.find(
    (app) => app.driveId && (app.driveId.type === 'Placement' || app.driveId.type === 'Internship + PPO')
  );

  // If student is already selected for a full-time placement, and this is another placement drive:
  if (selectedPlacementOffer && (drive.type === 'Placement' || drive.type === 'Internship + PPO')) {
    // Optional dream company upgrade check (e.g. if new offer package > 1.5x previous package)
    const upgradeAllowed = policySetting?.value?.allowDreamUpgrade || false;
    const upgradeMultiplier = policySetting?.value?.dreamMultiplier || 1.5;

    const previousPackage = selectedPlacementOffer.driveId?.package || 0;
    const isDreamUpgrade = drive.package >= previousPackage * upgradeMultiplier;

    if (upgradeAllowed && isDreamUpgrade) {
      return {
        isAllowed: true,
        reason: `Dream offer upgrade: New package (${drive.package} LPA) meets dream criteria over previous ${previousPackage} LPA offer.`,
      };
    }

    return {
      isAllowed: false,
      reason: `Institutional Placement Policy Restriction: You have already been selected for '${selectedPlacementOffer.driveId?.role}' and cannot apply for additional placement drives.`,
    };
  }

  return { isAllowed: true, reason: null };
};
