import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Company from '../models/Company.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, rollNumber, branch, CGPA, graduationYear, activeBacklogs } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    let companyId = null;

    // If registering as a recruiter with a company
    if (role === 'recruiter') {
      if (companyName) {
        let company = await Company.findOne({ name: companyName });
        if (!company) {
          company = await Company.create({ name: companyName });
        }
        companyId = company._id;
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      companyId,
    });

    // If recruiter, add user to company's recruiter list
    if (role === 'recruiter' && companyId) {
      await Company.findByIdAndUpdate(companyId, {
        $addToSet: { recruiterUserIds: user._id },
      });
    }

    // If student, initialize student profile
    if (user.role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        rollNumber: rollNumber || `22${(branch || 'CS').substring(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`,
        branch: branch || 'CSE',
        CGPA: CGPA !== undefined ? Number(CGPA) : 7.0,
        graduationYear: graduationYear ? Number(graduationYear) : 2026,
        activeBacklogs: activeBacklogs !== undefined ? Number(activeBacklogs) : 0,
        skills: [],
        resumeUrl: '',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).populate('companyId');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id }).populate('placedCompanyId');
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.companyId,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate or Register via Google OAuth
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { credential, email: directEmail, name: directName, avatar: directAvatar, role: selectedRole } = req.body;

    let email = directEmail;
    let name = directName;
    let avatar = directAvatar || '';
    let googleId = null;

    // If Google JWT ID token credential is provided, decode payload
    if (credential) {
      try {
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        email = decoded.email || email;
        name = decoded.name || name;
        avatar = decoded.picture || avatar;
        googleId = decoded.sub;
      } catch (err) {
        console.warn('Google credential decode fallback to direct params');
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Valid Google email is required' });
    }

    let user = await User.findOne({ email }).populate('companyId');

    if (!user) {
      // Auto-register new user with Google credentials
      const randomPassword = 'GAuth_' + Math.random().toString(36).slice(-10) + '!9X';
      const role = selectedRole || 'student';

      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: randomPassword,
        role,
        googleId: googleId || `google_${Date.now()}`,
        avatar,
      });

      if (role === 'student') {
        await StudentProfile.create({
          userId: user._id,
          rollNumber: `22CS${Math.floor(1000 + Math.random() * 9000)}`,
          branch: 'CSE',
          CGPA: 8.5,
          graduationYear: 2026,
          activeBacklogs: 0,
          skills: ['JavaScript', 'Python', 'React', 'Data Structures', 'Git'],
          resumeUrl: '',
        });
      }
    } else {
      // Link googleId/avatar if not present
      if (!user.googleId && googleId) {
        user.googleId = googleId;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
      }
      await user.save();
    }

    const token = generateToken(user._id);

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id }).populate('placedCompanyId');
    }

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.companyId,
        avatar: user.avatar,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('companyId');
    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id }).populate('placedCompanyId');
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.companyId,
        avatar: user.avatar,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};
