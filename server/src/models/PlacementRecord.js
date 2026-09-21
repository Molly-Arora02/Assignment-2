import mongoose from 'mongoose';

const placementRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    role: {
      type: String,
      required: true,
    },
    package: {
      type: Number, // In LPA
      required: true,
    },
    placementType: {
      type: String,
      enum: ['Placement', 'Internship', 'Internship + PPO'],
      default: 'Placement',
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    offerLetterUrl: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const PlacementRecord = mongoose.model('PlacementRecord', placementRecordSchema);
export default PlacementRecord;
