import mongoose from 'mongoose';

const driveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
    role: {
      type: String,
      required: [true, 'Job/Internship role title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Placement', 'Internship', 'Internship + PPO'],
      default: 'Placement',
    },
    package: {
      type: Number, // In LPA for placement, or thousand INR/month for internship
      required: [true, 'Package or stipend value is required'],
    },
    packageLabel: {
      type: String,
      default: '', // e.g. "₹12 LPA" or "₹45,000/mo"
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Bangalore / Hyderabad / Pune / Remote',
    },
    helpEmail: {
      type: String,
      default: '',
      trim: true,
    },
    contactPerson: {
      type: String,
      default: '',
      trim: true,
    },
    // Eligibility Criteria:
    minCGPA: {
      type: Number,
      default: 6.0,
      min: 0,
      max: 10,
    },
    eligibleBranches: {
      type: [String],
      default: ['CSE', 'IT', 'AI/ML', 'ECE'],
    },
    maxBacklogs: {
      type: Number,
      default: 0,
    },
    eligibleYears: {
      type: [Number],
      default: [2026],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled', 'Draft'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Drive = mongoose.model('Drive', driveSchema);
export default Drive;
