import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: '',
      trim: true,
    },
    helpEmail: {
      type: String,
      default: 'careers@company.com',
      trim: true,
    },
    hrContact: {
      type: String,
      default: 'University Relations & Campus Hiring Team',
      trim: true,
    },
    supportPhone: {
      type: String,
      default: '+91 80 4000 0000',
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Pan India / Hybrid',
    },
    recruiterUserIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);
export default Company;
