// Client-Side Stateful Mock Database & Engine
// Keeps all user interactions, applications, drives, profiles, and policy state persistent across sessions

export const DEFAULT_DRIVES = [
  {
    _id: 'drive_google_01',
    companyId: {
      _id: 'comp_google',
      name: 'Google India',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      website: 'https://careers.google.com',
      helpEmail: 'google-university-hiring@google.com',
      hrContact: 'Sarah Jenkins (University Talent Acquisition Lead)',
      supportPhone: '+91 80 6721 8000',
    },
    role: 'Software Development Engineer - I (Full-Time)',
    type: 'Placement',
    package: 28.5,
    packageLabel: '₹28.5 LPA CTC',
    description: 'Build large scale distributed systems, backend microservices, and AI-driven consumer products.',
    location: 'Bangalore / Hyderabad',
    minCGPA: 7.5,
    eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE'],
    maxBacklogs: 0,
    eligibleYears: [2026],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    _id: 'drive_msft_01',
    companyId: {
      _id: 'comp_microsoft',
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      website: 'https://careers.microsoft.com',
      helpEmail: 'msft-campus-recruitment@microsoft.com',
      hrContact: 'David Chen (University Talent & Engineering Hiring)',
      supportPhone: '+91 80 4000 3000',
    },
    role: 'Software Engineering Intern (Summer 2026)',
    type: 'Internship + PPO',
    package: 24.0,
    packageLabel: '₹80,000/month stipend (PPO: ₹24 LPA)',
    description: 'Develop next-generation cloud architecture, Azure tools, and Microsoft 365 AI capabilities.',
    location: 'Hyderabad / Bangalore',
    minCGPA: 7.0,
    eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE', 'EE'],
    maxBacklogs: 0,
    eligibleYears: [2026, 2027],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    _id: 'drive_amazon_01',
    companyId: {
      _id: 'comp_amazon',
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      website: 'https://amazon.jobs',
      helpEmail: 'amazon-university-support@amazon.com',
      hrContact: 'Anita Desai (AWS Student Programs)',
      supportPhone: '+91 80 4108 5000',
    },
    role: 'Cloud Support Associate & Dev Intern',
    type: 'Internship',
    package: 6.0,
    packageLabel: '₹50,000/month stipend',
    description: 'AWS Cloud engineering, architecture automation, and infrastructure troubleshooting.',
    location: 'Bangalore / Chennai',
    minCGPA: 6.0,
    eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE', 'EE', 'ME', 'CE'],
    maxBacklogs: 1,
    eligibleYears: [2026],
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    _id: 'drive_goldman_01',
    companyId: {
      _id: 'comp_goldman',
      name: 'Goldman Sachs',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg',
      website: 'https://www.goldmansachs.com/careers',
      helpEmail: 'gs-campusrecruiting@gs.com',
      hrContact: 'Rohan Mathur (Engineering Campus Recruiting Lead)',
      supportPhone: '+91 80 4127 0000',
    },
    role: 'Analyst - Global Markets Tech',
    type: 'Placement',
    package: 22.0,
    packageLabel: '₹22.0 LPA CTC',
    description: 'Algorithmic trading systems, high-frequency execution infrastructure, and quantitative models.',
    location: 'Bangalore',
    minCGPA: 8.0,
    eligibleBranches: ['CSE', 'IT', 'AI/ML'],
    maxBacklogs: 0,
    eligibleYears: [2026],
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    _id: 'drive_cisco_01',
    companyId: {
      _id: 'comp_cisco',
      name: 'Cisco Systems',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
      website: 'https://www.cisco.com',
      helpEmail: 'cisco-university-support@cisco.com',
      hrContact: 'Pooja Kulkarni (Early Career Programs Lead)',
      supportPhone: '+91 80 4426 0000',
    },
    role: 'Network Software Engineer',
    type: 'Placement',
    package: 14.5,
    packageLabel: '₹14.5 LPA CTC',
    description: 'SDN networking protocols, kernel programming, and enterprise cloud collaboration.',
    location: 'Bangalore',
    minCGPA: 6.5,
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EE'],
    maxBacklogs: 0,
    eligibleYears: [2026],
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    _id: 'drive_adobe_01',
    companyId: {
      _id: 'comp_adobe',
      name: 'Adobe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png',
      website: 'https://www.adobe.com',
      helpEmail: 'adobe-university-talent@adobe.com',
      hrContact: 'Meera Iyer (University Talent)',
      supportPhone: '+91 120 244 4555',
    },
    role: 'Member of Technical Staff - Creative Cloud',
    type: 'Placement',
    package: 26.0,
    packageLabel: '₹26.0 LPA CTC',
    description: 'High-performance graphics engines, WebAssembly tools, and generative AI models.',
    location: 'Noida / Bangalore',
    minCGPA: 8.0,
    eligibleBranches: ['CSE', 'IT', 'AI/ML'],
    maxBacklogs: 0,
    eligibleYears: [2026],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
  {
    _id: 'drive_deloitte_01',
    companyId: {
      _id: 'comp_deloitte',
      name: 'Deloitte',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
      website: 'https://www2.deloitte.com',
      helpEmail: 'deloitte-campus-desk@deloitte.com',
      hrContact: 'Vikram Singhania (Campus Lead - USI)',
      supportPhone: '+91 40 6670 4000',
    },
    role: 'Technology Consulting Analyst',
    type: 'Placement',
    package: 11.5,
    packageLabel: '₹11.5 LPA CTC',
    description: 'Enterprise cloud migration, cybersecurity risk advisory, and AI transformation.',
    location: 'Hyderabad / Bangalore / Mumbai',
    minCGPA: 6.5,
    eligibleBranches: ['CSE', 'IT', 'AI/ML', 'ECE', 'EE', 'ME', 'CE'],
    maxBacklogs: 1,
    eligibleYears: [2026],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
  },
];

export const DEFAULT_COMPANIES = [
  { _id: 'comp_google', name: 'Google India', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { _id: 'comp_microsoft', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { _id: 'comp_amazon', name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { _id: 'comp_goldman', name: 'Goldman Sachs', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg' },
  { _id: 'comp_cisco', name: 'Cisco Systems', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg' },
  { _id: 'comp_adobe', name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png' },
  { _id: 'comp_deloitte', name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg' },
];

export const DEFAULT_APPLICATIONS = [
  {
    _id: 'app_001',
    studentId: 'stud_aarav_001',
    driveId: DEFAULT_DRIVES[0],
    companyId: DEFAULT_DRIVES[0].companyId,
    status: 'Shortlisted',
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applicantSnapshot: {
      CGPA: 8.85,
      branch: 'CSE',
      activeBacklogs: 0,
      graduationYear: 2026,
      skills: ['React', 'Node.js', 'Python', 'Docker', 'PostgreSQL'],
      resumeUrl: 'https://example.com/resumes/aarav_sharma_swe.pdf',
    },
    statusHistory: [
      { status: 'Applied', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Application submitted via student portal' },
      { status: 'Shortlisted', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Resume shortlisted for Online Coding Assessment' },
    ],
  },
  {
    _id: 'app_002',
    studentId: 'stud_priya_001',
    driveId: DEFAULT_DRIVES[1],
    companyId: DEFAULT_DRIVES[1].companyId,
    status: 'Selected',
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    applicantSnapshot: {
      CGPA: 9.3,
      branch: 'AI/ML',
      activeBacklogs: 0,
      graduationYear: 2026,
      skills: ['PyTorch', 'TensorFlow', 'Python', 'MLOps'],
      resumeUrl: 'https://example.com/resumes/priya_nair_ai.pdf',
    },
    statusHistory: [
      { status: 'Applied', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Application submitted' },
      { status: 'Shortlisted', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Shortlisted based on CGPA and ML projects' },
      { status: 'Interviewed', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Cleared Technical and System Architecture rounds' },
      { status: 'Selected', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Offer extended: Summer 2026 Internship + PPO' },
    ],
  },
];

// LocalStorage helpers
export function getMockDrives() {
  const saved = localStorage.getItem('campusconnect_drives');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('campusconnect_drives', JSON.stringify(DEFAULT_DRIVES));
  return DEFAULT_DRIVES;
}

export function saveMockDrives(drives) {
  localStorage.setItem('campusconnect_drives', JSON.stringify(drives));
}

export function getMockApplications() {
  const saved = localStorage.getItem('campusconnect_applications');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('campusconnect_applications', JSON.stringify(DEFAULT_APPLICATIONS));
  return DEFAULT_APPLICATIONS;
}

export function saveMockApplications(apps) {
  localStorage.setItem('campusconnect_applications', JSON.stringify(apps));
}

export function getMockPolicy() {
  const saved = localStorage.getItem('campusconnect_policy');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  const defaultPolicy = {
    enabled: true,
    allowDreamUpgrade: true,
    dreamMultiplier: 1.5,
    maxBacklogsAllowedInstitutionWide: 2,
  };
  localStorage.setItem('campusconnect_policy', JSON.stringify(defaultPolicy));
  return defaultPolicy;
}

export function saveMockPolicy(policy) {
  localStorage.setItem('campusconnect_policy', JSON.stringify(policy));
}
