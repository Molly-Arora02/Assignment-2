import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
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
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statusHistory: [statusHistorySchema],
    applicantSnapshot: {
      CGPA: Number,
      branch: String,
      activeBacklogs: Number,
      graduationYear: Number,
      resumeUrl: String,
      skills: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by same student to the same drive
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
