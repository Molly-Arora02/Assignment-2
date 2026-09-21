import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Company from '../models/Company.js';
import Drive from '../models/Drive.js';
import Application from '../models/Application.js';
import PlacementRecord from '../models/PlacementRecord.js';
import Setting from '../models/Setting.js';

export const seedDatabase = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('⚡ Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('🌱 Pre-seeding CampusConnect with realistic demo data...');

    // 1. Create Placement Policy Settings
    await Setting.create({
      key: 'oneOfferPolicy',
      value: {
        enabled: true,
        allowDreamUpgrade: true,
        dreamMultiplier: 1.5,
        maxBacklogsAllowedInstitutionWide: 2,
      },
      description: 'Single-offer restriction with dream package upgrade policy (1.5x CTC)',
    });

    // 2. Create Companies
    const google = await Company.create({
      name: 'Google India',
      domain: 'google.com',
      website: 'https://careers.google.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      helpEmail: 'google-university-hiring@google.com',
      hrContact: 'Sarah Jenkins (University Talent Acquisition Lead)',
      supportPhone: '+91 80 6721 8000',
      description: 'Google LLC is an American multinational technology company focusing on search, AI, cloud computing, online advertising, and hardware.',
      location: 'Bangalore / Hyderabad',
    });

    const microsoft = await Company.create({
      name: 'Microsoft',
      domain: 'microsoft.com',
      website: 'https://careers.microsoft.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      helpEmail: 'msft-campus-recruitment@microsoft.com',
      hrContact: 'David Chen (University Talent & Engineering Hiring)',
      supportPhone: '+91 80 4000 3000',
      description: 'Microsoft Corporation produces computer software, cloud infrastructure, consumer electronics, and gaming services.',
      location: 'Hyderabad / Noida / Bangalore',
    });

    const amazon = await Company.create({
      name: 'Amazon',
      domain: 'amazon.com',
      website: 'https://amazon.jobs',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      helpEmail: 'amazon-university-support@amazon.com',
      hrContact: 'Anita Desai (Student Programs India & AWS Recruiting)',
      supportPhone: '+91 80 4108 5000',
      description: 'Amazon.com, Inc. focuses on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence.',
      location: 'Bangalore / Hyderabad / Chennai',
    });

    const cisco = await Company.create({
      name: 'Cisco Systems',
      domain: 'cisco.com',
      website: 'https://www.cisco.com/c/en/us/about/careers.html',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
      helpEmail: 'cisco-university-support@cisco.com',
      hrContact: 'Pooja Kulkarni (Early Career Programs Lead)',
      supportPhone: '+91 80 4426 0000',
      description: 'Cisco is a worldwide leader in networking, enterprise security, and cloud collaboration technologies.',
      location: 'Bangalore',
    });

    const goldman = await Company.create({
      name: 'Goldman Sachs',
      domain: 'goldmansachs.com',
      website: 'https://www.goldmansachs.com/careers',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg',
      helpEmail: 'gs-campusrecruiting@gs.com',
      hrContact: 'Rohan Mathur (Engineering Campus Recruiting Lead)',
      supportPhone: '+91 80 4127 0000',
      description: 'Leading global investment banking, securities, quantitative asset and investment management firm.',
      location: 'Bangalore / Hyderabad',
    });

    const adobe = await Company.create({
      name: 'Adobe',
      domain: 'adobe.com',
      website: 'https://www.adobe.com/careers.html',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png',
      helpEmail: 'adobe-university-talent@adobe.com',
      hrContact: 'Meera Iyer (University Talent & Research Relations)',
      supportPhone: '+91 120 244 4555',
      description: 'Adobe is the global leader in digital media and digital marketing solutions.',
      location: 'Noida / Bangalore',
    });

    const deloitte = await Company.create({
      name: 'Deloitte',
      domain: 'deloitte.com',
      website: 'https://www2.deloitte.com/in/en/careers.html',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
      helpEmail: 'deloitte-campus-desk@deloitte.com',
      hrContact: 'Vikram Singhania (Campus Recruitment Lead - USI)',
      supportPhone: '+91 40 6670 4000',
      description: 'Deloitte provides industry-leading audit, consulting, tax, and advisory services.',
      location: 'Hyderabad / Bangalore / Mumbai',
    });

    // 3. Create Admin & Recruiter Users
    const adminUser = await User.create({
      name: 'Prof. Rajesh Sharma (Head TPO)',
      email: 'admin@campusconnect.edu',
      password: 'admin123',
      role: 'admin',
    });

    const googleRecruiter = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter.google@campusconnect.edu',
      password: 'recruiter123',
      role: 'recruiter',
      companyId: google._id,
    });
    google.recruiterUserIds.push(googleRecruiter._id);
    await google.save();

    const microsoftRecruiter = await User.create({
      name: 'David Chen',
      email: 'recruiter.microsoft@campusconnect.edu',
      password: 'recruiter123',
      role: 'recruiter',
      companyId: microsoft._id,
    });
    microsoft.recruiterUserIds.push(microsoftRecruiter._id);
    await microsoft.save();

    const amazonRecruiter = await User.create({
      name: 'Anita Desai',
      email: 'recruiter.amazon@campusconnect.edu',
      password: 'recruiter123',
      role: 'recruiter',
      companyId: amazon._id,
    });
    amazon.recruiterUserIds.push(amazonRecruiter._id);
    await amazon.save();

    // 4. Create Students and Profiles
    // Student 1: Aarav (High CGPA, CSE, Placed)
    const aaravUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.cse@campusconnect.edu',
      password: 'student123',
      role: 'student',
    });
    const aaravProfile = await StudentProfile.create({
      userId: aaravUser._id,
      rollNumber: '22CS1045',
      branch: 'CSE',
      CGPA: 8.85,
      skills: ['React', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'Data Structures'],
      resumeUrl: 'https://example.com/resumes/aarav_sharma_swe.pdf',
      graduationYear: 2026,
      activeBacklogs: 0,
      phone: '+91 98765 43210',
      isPlaced: false,
    });

    // Student 2: Diya (Decent CGPA, IT, 0 Backlogs)
    const diyaUser = await User.create({
      name: 'Diya Patel',
      email: 'diya.it@campusconnect.edu',
      password: 'student123',
      role: 'student',
    });
    const diyaProfile = await StudentProfile.create({
      userId: diyaUser._id,
      rollNumber: '22IT2031',
      branch: 'IT',
      CGPA: 7.6,
      skills: ['Java', 'Spring Boot', 'MySQL', 'JavaScript', 'AWS'],
      resumeUrl: 'https://example.com/resumes/diya_patel_dev.pdf',
      graduationYear: 2026,
      activeBacklogs: 0,
      phone: '+91 98765 43211',
      isPlaced: false,
    });

    // Student 3: Rohan (Lower CGPA, ECE, 1 Backlog - for testing ineligibility)
    const rohanUser = await User.create({
      name: 'Rohan Verma',
      email: 'rohan.ece@campusconnect.edu',
      password: 'student123',
      role: 'student',
    });
    const rohanProfile = await StudentProfile.create({
      userId: rohanUser._id,
      rollNumber: '22EC3019',
      branch: 'ECE',
      CGPA: 6.4,
      skills: ['C++', 'Embedded Systems', 'Verilog', 'IoT'],
      resumeUrl: 'https://example.com/resumes/rohan_verma_hardware.pdf',
      graduationYear: 2026,
      activeBacklogs: 1,
      phone: '+91 98765 43212',
      isPlaced: false,
    });

    // Student 4: Priya (High CGPA, AI/ML, already placed at Microsoft - for testing policy enforcement)
    const priyaUser = await User.create({
      name: 'Priya Nair',
      email: 'priya.aiml@campusconnect.edu',
      password: 'student123',
      role: 'student',
    });
    const priyaProfile = await StudentProfile.create({
      userId: priyaUser._id,
      rollNumber: '22AI4008',
      branch: 'AI/ML',
      CGPA: 9.3,
      skills: ['PyTorch', 'TensorFlow', 'Python', 'MLOps', 'NLP', 'Computer Vision'],
      resumeUrl: 'https://example.com/resumes/priya_nair_ai.pdf',
      graduationYear: 2026,
      activeBacklogs: 0,
      phone: '+91 98765 43213',
      isPlaced: true,
      placedCompanyId: microsoft._id,
      placedPackage: 24,
    });

    // Student 5: Siddharth (Mechanical, 7.8 CGPA)
    const sidUser = await User.create({
      name: 'Siddharth Rao',
      email: 'siddharth.me@campusconnect.edu',
      password: 'student123',
      role: 'student',
    });
    const sidProfile = await StudentProfile.create({
      userId: sidUser._id,
      rollNumber: '22ME5012',
      branch: 'ME',
      CGPA: 7.8,
      skills: ['AutoCAD', 'SolidWorks', 'Python', 'MATLAB'],
      resumeUrl: 'https://example.com/resumes/siddharth_rao.pdf',
      graduationYear: 2026,
      activeBacklogs: 0,
      phone: '+91 98765 43214',
      isPlaced: false,
    });

    // 5. Create Recruitment Drives
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 20);

    const googleDrive = await Drive.create({
      companyId: google._id,
      role: 'Software Development Engineer - I (Full-Time)',
      type: 'Placement',
      package: 28.5,
      packageLabel: '₹28.5 LPA CTC',
      description: 'Build large scale distributed systems, backend microservices, and AI-driven consumer products.',
      location: 'Bangalore / Hyderabad',
      helpEmail: 'google-university-hiring@google.com',
      contactPerson: 'Sarah Jenkins (Tech Recruiting)',
      minCGPA: 7.5,
      eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE'],
      maxBacklogs: 0,
      eligibleYears: [2026],
      deadline: nextMonth,
      status: 'Active',
      createdBy: googleRecruiter._id,
    });

    const msftDrive = await Drive.create({
      companyId: microsoft._id,
      role: 'Software Engineering Intern (Summer 2026)',
      type: 'Internship + PPO',
      package: 24.0,
      packageLabel: '₹80,000/month stipend (PPO: ₹24 LPA)',
      description: 'Develop next-generation cloud architecture, Azure tools, and Microsoft 365 AI capabilities.',
      location: 'Hyderabad / Bangalore',
      helpEmail: 'msft-campus-recruitment@microsoft.com',
      contactPerson: 'David Chen (University Programs)',
      minCGPA: 7.0,
      eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE', 'EE'],
      maxBacklogs: 0,
      eligibleYears: [2026, 2027],
      deadline: nextMonth,
      status: 'Active',
      createdBy: microsoftRecruiter._id,
    });

    const amazonDrive = await Drive.create({
      companyId: amazon._id,
      role: 'Cloud Support Associate & Dev Intern',
      type: 'Internship',
      package: 6.0,
      packageLabel: '₹50,000/month stipend',
      description: 'AWS Cloud engineering, architecture automation, and infrastructure troubleshooting.',
      location: 'Bangalore / Chennai',
      helpEmail: 'amazon-university-support@amazon.com',
      contactPerson: 'Anita Desai (AWS Student Programs)',
      minCGPA: 6.0,
      eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE', 'EE', 'ME', 'CE'],
      maxBacklogs: 1,
      eligibleYears: [2026],
      deadline: nextMonth,
      status: 'Active',
      createdBy: amazonRecruiter._id,
    });

    const goldmanDrive = await Drive.create({
      companyId: goldman._id,
      role: 'Analyst - Global Markets Tech',
      type: 'Placement',
      package: 22.0,
      packageLabel: '₹22.0 LPA CTC',
      description: 'Algorithmic trading systems, high-frequency execution infrastructure, and quantitative models.',
      location: 'Bangalore',
      helpEmail: 'gs-campusrecruiting@gs.com',
      contactPerson: 'Rohan Mathur (Campus Talent)',
      minCGPA: 8.0,
      eligibleBranches: ['CSE', 'IT', 'AI/ML'],
      maxBacklogs: 0,
      eligibleYears: [2026],
      deadline: nextMonth,
      status: 'Active',
      createdBy: adminUser._id,
    });

    const ciscoDrive = await Drive.create({
      companyId: cisco._id,
      role: 'Network Software Engineer',
      type: 'Placement',
      package: 14.5,
      packageLabel: '₹14.5 LPA CTC',
      description: 'SDN networking protocols, kernel programming, and cybersecurity switches.',
      location: 'Bangalore',
      helpEmail: 'cisco-university-support@cisco.com',
      contactPerson: 'Pooja Kulkarni (Early Career)',
      minCGPA: 6.5,
      eligibleBranches: ['CSE', 'IT', 'ECE', 'EE'],
      maxBacklogs: 0,
      eligibleYears: [2026],
      deadline: nextMonth,
      status: 'Active',
      createdBy: adminUser._id,
    });

    const adobeDrive = await Drive.create({
      companyId: adobe._id,
      role: 'Member of Technical Staff - Creative Cloud',
      type: 'Placement',
      package: 26.0,
      packageLabel: '₹26.0 LPA CTC',
      description: 'Build high-performance graphics engines, WebAssembly tools, and generative AI creative models.',
      location: 'Noida / Bangalore',
      helpEmail: 'adobe-university-talent@adobe.com',
      contactPerson: 'Meera Iyer (University Talent)',
      minCGPA: 8.0,
      eligibleBranches: ['CSE', 'IT', 'AI/ML'],
      maxBacklogs: 0,
      eligibleYears: [2026],
      deadline: nextMonth,
      status: 'Active',
      createdBy: adminUser._id,
    });

    const deloitteDrive = await Drive.create({
      companyId: deloitte._id,
      role: 'Technology Consulting Analyst',
      type: 'Placement',
      package: 11.5,
      packageLabel: '₹11.5 LPA CTC',
      description: 'Enterprise cloud migration, SAP/Salesforce architecture, and cyber risk advisory.',
      location: 'Hyderabad / Bangalore / Mumbai',
      helpEmail: 'deloitte-campus-desk@deloitte.com',
      contactPerson: 'Vikram Singhania (Campus Lead)',
      minCGPA: 6.5,
      eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE', 'EE', 'ME', 'CE'],
      maxBacklogs: 1,
      eligibleYears: [2026],
      deadline: nextMonth,
      status: 'Active',
      createdBy: adminUser._id,
    });

    // 6. Pre-create sample applications & placement history
    // Priya Nair -> Microsoft Drive (Selected)
    const priyaApp = await Application.create({
      studentId: priyaUser._id,
      studentProfileId: priyaProfile._id,
      driveId: msftDrive._id,
      companyId: microsoft._id,
      status: 'Selected',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      applicantSnapshot: {
        CGPA: priyaProfile.CGPA,
        branch: priyaProfile.branch,
        activeBacklogs: priyaProfile.activeBacklogs,
        graduationYear: priyaProfile.graduationYear,
        resumeUrl: priyaProfile.resumeUrl,
        skills: priyaProfile.skills,
      },
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: priyaUser._id,
          role: 'student',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          notes: 'Application submitted via student portal',
        },
        {
          status: 'Shortlisted',
          updatedBy: microsoftRecruiter._id,
          role: 'recruiter',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          notes: 'Strong machine learning background & top 5% CGPA',
        },
        {
          status: 'Interviewed',
          updatedBy: microsoftRecruiter._id,
          role: 'recruiter',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          notes: 'Cleared Technical Round 1 and System Design Round 2',
        },
        {
          status: 'Selected',
          updatedBy: microsoftRecruiter._id,
          role: 'recruiter',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          notes: 'Offer extended: Summer 2026 Internship + PPO',
        },
      ],
    });

    await PlacementRecord.create({
      studentId: priyaUser._id,
      studentProfileId: priyaProfile._id,
      companyId: microsoft._id,
      driveId: msftDrive._id,
      applicationId: priyaApp._id,
      role: msftDrive.role,
      package: 24.0,
      placementType: msftDrive.type,
      academicYear: '2025-2026',
      verifiedBy: adminUser._id,
    });

    // Aarav Sharma -> Google Drive (Shortlisted)
    await Application.create({
      studentId: aaravUser._id,
      studentProfileId: aaravProfile._id,
      driveId: googleDrive._id,
      companyId: google._id,
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      applicantSnapshot: {
        CGPA: aaravProfile.CGPA,
        branch: aaravProfile.branch,
        activeBacklogs: aaravProfile.activeBacklogs,
        graduationYear: aaravProfile.graduationYear,
        resumeUrl: aaravProfile.resumeUrl,
        skills: aaravProfile.skills,
      },
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: aaravUser._id,
          role: 'student',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
          notes: 'Application submitted',
        },
        {
          status: 'Shortlisted',
          updatedBy: googleRecruiter._id,
          role: 'recruiter',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          notes: 'Resume shortlisted for Online Assessment Round',
        },
      ],
    });

    // Diya Patel -> Cisco Drive (Applied)
    await Application.create({
      studentId: diyaUser._id,
      studentProfileId: diyaProfile._id,
      driveId: ciscoDrive._id,
      companyId: cisco._id,
      status: 'Applied',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      applicantSnapshot: {
        CGPA: diyaProfile.CGPA,
        branch: diyaProfile.branch,
        activeBacklogs: diyaProfile.activeBacklogs,
        graduationYear: diyaProfile.graduationYear,
        resumeUrl: diyaProfile.resumeUrl,
        skills: diyaProfile.skills,
      },
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: diyaUser._id,
          role: 'student',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          notes: 'Application submitted',
        },
      ],
    });

    console.log('✅ CampusConnect demo data seeded successfully with realistic accounts!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};
