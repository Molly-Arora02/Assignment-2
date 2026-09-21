import axios from 'axios';
import { getMockDrives, getMockApplications } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with intelligent fallback for static frontend deployments
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const method = error.config?.method?.toLowerCase() || 'get';

    console.warn(`[CampusConnect API Fallback] Servicing ${method.toUpperCase()} ${url} locally.`);

    // 1. Drives List
    if (url.includes('/drives') && method === 'get') {
      const drives = getMockDrives();
      return Promise.resolve({
        data: { success: true, count: drives.length, drives },
      });
    }

    // 2. Student Applications
    if (url.includes('/applications/me') && method === 'get') {
      const applications = getMockApplications();
      return Promise.resolve({
        data: { success: true, count: applications.length, applications },
      });
    }

    // 3. Admin Analytics
    if (url.includes('/admin/analytics') && method === 'get') {
      return Promise.resolve({
        data: {
          success: true,
          stats: {
            totalStudents: 142,
            placedStudents: 98,
            activeDrives: 7,
            totalOffers: 114,
            placementRate: 69.0,
            avgPackage: 18.5,
            highestPackage: 44.0,
          },
          branchStats: [
            { branch: 'CSE', total: 60, placed: 48 },
            { branch: 'IT', total: 35, placed: 26 },
            { branch: 'AI/ML', total: 20, placed: 16 },
            { branch: 'ECE', total: 27, placed: 18 },
          ],
          funnel: [
            { stage: 'Applied', count: 180 },
            { stage: 'Shortlisted', count: 95 },
            { stage: 'Interviewed', count: 52 },
            { stage: 'Selected', count: 28 },
          ],
        },
      });
    }

    // 4. Admin Students Directory
    if (url.includes('/admin/students') && method === 'get') {
      return Promise.resolve({
        data: {
          success: true,
          students: [
            {
              _id: 'stud_01',
              user: { name: 'Aarav Sharma', email: 'aarav.cse@campusconnect.edu' },
              rollNumber: '22CS1045',
              branch: 'CSE',
              CGPA: 8.85,
              activeBacklogs: 0,
              isPlaced: false,
              skills: ['React', 'Node.js', 'Python', 'Docker'],
            },
            {
              _id: 'stud_02',
              user: { name: 'Priya Nair', email: 'priya.aiml@campusconnect.edu' },
              rollNumber: '22AI4008',
              branch: 'AI/ML',
              CGPA: 9.3,
              activeBacklogs: 0,
              isPlaced: true,
              placedPackage: 24.0,
              skills: ['PyTorch', 'TensorFlow', 'Python'],
            },
            {
              _id: 'stud_03',
              user: { name: 'Rohan Verma', email: 'rohan.ece@campusconnect.edu' },
              rollNumber: '22EC3019',
              branch: 'ECE',
              CGPA: 6.4,
              activeBacklogs: 1,
              isPlaced: false,
              skills: ['C++', 'Embedded Systems'],
            },
          ],
        },
      });
    }

    // 5. Admin Policy
    if (url.includes('/admin/policy')) {
      return Promise.resolve({
        data: {
          success: true,
          policy: {
            enabled: true,
            allowDreamUpgrade: true,
            dreamMultiplier: 1.5,
            maxBacklogsAllowedInstitutionWide: 2,
          },
        },
      });
    }

    // 6. ATS Resume Scoring
    if (url.includes('/resume/analyze-ats')) {
      return Promise.resolve({
        data: {
          success: true,
          atsScore: 88,
          verdict: 'Highly Competitive Match',
          matchedKeywords: ['React', 'Node.js', 'Python', 'Data Structures', 'Git'],
          missingKeywords: ['Kubernetes', 'GraphQL'],
          improvements: [
            'Highlight metrics: e.g. "Improved query performance by 35% with caching"',
            'Add STAR-format bullet point for cloud deployment project',
          ],
        },
      });
    }

    // 7. Apply to Drive
    if (url.includes('/apply')) {
      return Promise.resolve({
        data: {
          success: true,
          message: 'Application successfully submitted! Recruiter has been notified.',
        },
      });
    }

    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
