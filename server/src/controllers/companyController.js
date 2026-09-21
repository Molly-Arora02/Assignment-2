import Company from '../models/Company.js';

// @desc    Get all registered recruiting companies
// @route   GET /api/companies
// @access  Public / Authenticated
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('recruiterUserIds', 'name email');
    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private (Admin)
export const createCompany = async (req, res, next) => {
  try {
    const { name, website, logo, description, location } = req.body;

    const company = await Company.create({
      name,
      website,
      logo,
      description,
      location,
    });

    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};
