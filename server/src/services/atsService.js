import { checkStudentEligibility } from './eligibilityService.js';
import { checkPlacementPolicy } from './policyService.js';

// Comprehensive technical dictionary for semantic ATS matching
const TECH_KEYWORDS_DICTIONARY = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST', 'RESTful APIs', 'Microservices',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Git', 'GitHub', 'CI/CD', 'Jenkins',
  'Data Structures', 'Algorithms', 'System Design', 'OOP', 'Object Oriented Programming',
  'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision',
  'Agile', 'Scrum', 'Unit Testing', 'Jest', 'Mocha', 'Distributed Systems', 'Kafka', 'RabbitMQ',
  'Cloud Computing', 'Cybersecurity', 'TCP/IP', 'Networking', 'Scalability', 'Performance Optimization'
];

const ACTION_VERBS = [
  'Architected', 'Engineered', 'Developed', 'Spearheaded', 'Optimized', 'Automated', 'Deployed',
  'Implemented', 'Designed', 'Refactored', 'Accelerated', 'Scaled', 'Reduced', 'Integrated', 'Built'
];

/**
 * Extract keywords from job description text and role
 */
export const extractJobKeywords = (jobRole = '', jobDescription = '', companyName = '') => {
  const fullText = `${jobRole} ${jobDescription} ${companyName}`.toLowerCase();
  
  const extractedTech = TECH_KEYWORDS_DICTIONARY.filter((keyword) => {
    const regex = new RegExp(`\\b${keyword.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')}\\b`, 'i');
    return regex.test(fullText);
  });

  // Default essentials if description is brief
  if (extractedTech.length < 4) {
    if (/software|developer|sde|swe/i.test(jobRole)) {
      extractedTech.push('Data Structures', 'Algorithms', 'Git', 'System Design');
    } else if (/cloud|aws|devops/i.test(jobRole)) {
      extractedTech.push('AWS', 'Linux', 'Docker', 'CI/CD');
    } else if (/analyst|data|market/i.test(jobRole)) {
      extractedTech.push('Python', 'SQL', 'Algorithms', 'Data Structures');
    }
  }

  return [...new Set(extractedTech)];
};

/**
 * Comprehensive ATS Match & Multi-factor Scoring
 */
export const calculateATSScore = (resumeText = '', studentSkills = [], targetDrive = {}) => {
  const jobRole = targetDrive.role || 'Software Engineer';
  const jobDesc = targetDrive.description || '';
  const companyName = targetDrive.companyId?.name || targetDrive.companyName || 'Corporate Partner';

  const requiredKeywords = extractJobKeywords(jobRole, jobDesc, companyName);
  
  // Combine resume text and structured skills
  const fullResumeContent = `${resumeText} ${(studentSkills || []).join(' ')}`.toLowerCase();

  // 1. Keyword Matching (40% weight)
  const matchedKeywords = [];
  const missingKeywords = [];

  requiredKeywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')}\\b`, 'i');
    if (regex.test(fullResumeContent)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatchRate = requiredKeywords.length > 0 
    ? Math.round((matchedKeywords.length / requiredKeywords.length) * 100)
    : 75;

  // 2. Action Verb & Impact Strength (25% weight)
  let actionVerbCount = 0;
  ACTION_VERBS.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(fullResumeContent)) actionVerbCount++;
  });
  const actionVerbScore = Math.min(100, Math.round((actionVerbCount / 4) * 100));

  // Quantifiable metrics detection (%, ms, X, numbers)
  const metricMatches = fullResumeContent.match(/\b\d+(\.\d+)?(%|x|ms|k|m|lpa|\+)\b/gi) || [];
  const impactMetricScore = Math.min(100, metricMatches.length * 25);

  // 3. Formatting & Structural Readability (15% weight)
  const hasSummary = /summary|profile|about/i.test(fullResumeContent);
  const hasSkills = /skills|technologies|stack/i.test(fullResumeContent) || (studentSkills && studentSkills.length > 0);
  const hasProjects = /project|experience|work|portfolio/i.test(fullResumeContent);
  const hasEducation = /education|university|college|b\.tech|cgpa/i.test(fullResumeContent);

  let structureScore = 40;
  if (hasSummary) structureScore += 15;
  if (hasSkills) structureScore += 15;
  if (hasProjects) structureScore += 15;
  if (hasEducation) structureScore += 15;

  // 4. Skills Density (20% weight)
  const skillDensityScore = Math.min(100, Math.round(((studentSkills?.length || 3) / 8) * 100));

  // Calculate Overall Weighted ATS Score (0 - 100)
  const overallScore = Math.min(
    98,
    Math.max(
      35,
      Math.round(
        keywordMatchRate * 0.40 +
        ((actionVerbScore + impactMetricScore) / 2) * 0.25 +
        structureScore * 0.15 +
        skillDensityScore * 0.20
      )
    )
  );

  return {
    overallScore,
    keywordMatchRate,
    actionVerbScore,
    impactMetricScore,
    structureScore,
    skillDensityScore,
    requiredKeywords,
    matchedKeywords,
    missingKeywords,
    metricsDetected: metricMatches.length,
    actionVerbsFound: actionVerbCount,
  };
};

/**
 * AI Tailoring Engine: Generates tailored summary, optimized STAR bullet points, and skills
 */
export const generateTailoredResume = (studentProfile = {}, targetDrive = {}, studentUser = {}) => {
  const companyName = targetDrive.companyId?.name || targetDrive.companyName || 'Corporate Partner';
  const roleTitle = targetDrive.role || 'Software Development Engineer';
  const branch = studentProfile.branch || 'CSE';
  const cgpa = studentProfile.CGPA || 8.0;
  const currentSkills = studentProfile.skills?.length > 0 
    ? studentProfile.skills 
    : ['JavaScript', 'Python', 'React', 'Data Structures', 'Git', 'SQL'];

  const targetKeywords = extractJobKeywords(roleTitle, targetDrive.description || '', companyName);

  // Merge & prioritize skills for the target job
  const combinedSkills = [...new Set([...targetKeywords.slice(0, 5), ...currentSkills])];

  // 1. Tailored Professional Summary
  const tailoredSummary = `Results-driven ${branch} pre-final/final year engineer (CGPA: ${cgpa}) with hands-on expertise in ${combinedSkills.slice(0, 4).join(', ')}. Eager to contribute to ${companyName}'s high-impact engineering initiatives for the ${roleTitle} opportunity by developing scalable, reliable systems and solving complex computational challenges.`;

  // 2. High-Impact STAR Format Accomplishment Bullets
  const tailoredBulletPoints = [
    `Architected and deployed full-stack solutions utilizing ${combinedSkills[0] || 'React'} and ${combinedSkills[1] || 'Node.js'}, achieving a 35% reduction in API latency and supporting concurrent user requests.`,
    `Engineered automated data pipelines and optimized database queries in ${combinedSkills[2] || 'PostgreSQL'}, resulting in 40% faster query execution times across production environments.`,
    `Implemented robust CI/CD workflows and unit test suites with 90%+ code coverage, accelerating deployment velocity and maintaining zero critical production regressions.`,
    `Collaborated across cross-functional engineering teams applying Agile methodologies to deliver end-to-end features for scalable distributed architectures.`,
  ];

  // 3. Actionable ATS Recommendations
  const atsRecommendations = [
    `Integrate targeted keywords like "${targetKeywords.slice(0, 3).join('", "')}" directly into your project descriptions.`,
    `Quantify your accomplishments using metrics (e.g. latency improvements, user counts, performance gains).`,
    `Ensure your technical skills section highlights tools specifically aligned with ${companyName}'s job description.`,
    `Maintain clear ATS-friendly section headers: Summary, Technical Skills, Projects, and Education.`,
  ];

  return {
    tailoredSummary,
    tailoredBulletPoints,
    recommendedSkills: combinedSkills,
    atsRecommendations,
    targetRole: roleTitle,
    targetCompany: companyName,
  };
};

/**
 * Complete Evaluation: Academic Eligibility + ATS Scoring + AI Tailoring
 */
export const evaluateAndTailor = async (studentProfile, targetDrive, studentUser, rawResumeText = '') => {
  // 1. Check Hard Academic Eligibility Server-Side
  const eligibilityResult = checkStudentEligibility(studentProfile, targetDrive);
  const policyCheck = await checkPlacementPolicy(studentUser._id, targetDrive);

  const isEligible = eligibilityResult.isEligible && policyCheck.isAllowed;
  const barriers = [
    ...eligibilityResult.reasons,
    ...(policyCheck.isAllowed ? [] : [policyCheck.reason]),
  ];

  // 2. Compute ATS Compatibility Score
  const atsAnalysis = calculateATSScore(
    rawResumeText,
    studentProfile.skills,
    targetDrive
  );

  // 3. Generate AI Tailored Content
  const tailoredResume = generateTailoredResume(
    studentProfile,
    targetDrive,
    studentUser
  );

  return {
    eligibility: {
      isEligible,
      barriers,
      criteriaDetails: eligibilityResult.details,
      policyAllowed: policyCheck.isAllowed,
      policyReason: policyCheck.reason,
    },
    atsAnalysis,
    tailoredResume,
  };
};
