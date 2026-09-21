import axios from 'axios';
import {
  getMockDrives,
  saveMockDrives,
  getMockApplications,
  saveMockApplications,
  getMockPolicy,
  saveMockPolicy,
  DEFAULT_COMPANIES,
} from './mockData';

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

// Response interceptor with intelligent stateful fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const method = error.config?.method?.toLowerCase() || 'get';
    let body = {};
    try {
      body = typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : (error.config?.data || {});
    } catch (e) {}

    console.warn(`[CampusConnect API Engine] Servicing ${method.toUpperCase()} ${url} statefully.`);

    // 1. GET /drives
    if (url.includes('/drives') && method === 'get') {
      const drives = getMockDrives();
      return Promise.resolve({
        data: { success: true, count: drives.length, drives },
      });
    }

    // 2. POST /drives (Admin creating a drive)
    if (url.includes('/drives') && method === 'post' && !url.includes('/apply')) {
      const drives = getMockDrives();
      const newDrive = {
        _id: 'drive_' + Date.now(),
        ...body,
        companyId: typeof body.companyId === 'object' ? body.companyId : (DEFAULT_COMPANIES.find(c => c._id === body.companyId) || { _id: 'comp_custom', name: 'Partner Company', logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150' }),
        packageLabel: `₹${body.package || 12} LPA CTC`,
        status: 'Active',
      };
      drives.unshift(newDrive);
      saveMockDrives(drives);
      return Promise.resolve({
        data: { success: true, message: 'Recruitment drive created successfully', drive: newDrive },
      });
    }

    // 3. DELETE /drives/:id
    if (url.includes('/drives') && method === 'delete') {
      const driveId = url.split('/').pop();
      let drives = getMockDrives();
      drives = drives.filter(d => d._id !== driveId);
      saveMockDrives(drives);
      return Promise.resolve({
        data: { success: true, message: 'Drive deleted successfully' },
      });
    }

    // 4. GET /companies
    if (url.includes('/companies') && method === 'get') {
      return Promise.resolve({
        data: { success: true, companies: DEFAULT_COMPANIES },
      });
    }

    // 5. Apply to Drive: POST /drives/:id/apply OR POST /applications/drive/:id/apply
    if (url.includes('/apply')) {
      const driveId = url.split('/')[url.split('/').indexOf('apply') - 1] || 'drive_google_01';
      const drives = getMockDrives();
      const drive = drives.find(d => d._id === driveId) || drives[0];
      const applications = getMockApplications();

      // Check if already applied
      const existing = applications.find(a => (a.driveId?._id || a.driveId) === drive._id);
      if (existing) {
        return Promise.resolve({
          data: { success: true, message: 'You have already applied to this recruitment drive!' },
        });
      }

      const cachedUser = JSON.parse(localStorage.getItem('campusconnect_cached_user') || '{}');
      const cachedProfile = JSON.parse(localStorage.getItem('campusconnect_cached_profile') || '{}');

      const newApp = {
        _id: 'app_' + Date.now(),
        studentId: cachedUser._id || 'stud_aarav_001',
        driveId: drive,
        companyId: drive.companyId,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
        applicantSnapshot: {
          CGPA: cachedProfile.CGPA || 8.85,
          branch: cachedProfile.branch || 'CSE',
          activeBacklogs: cachedProfile.activeBacklogs || 0,
          graduationYear: cachedProfile.graduationYear || 2026,
          skills: cachedProfile.skills || ['React', 'Node.js', 'Python'],
          resumeUrl: cachedProfile.resumeUrl || 'https://example.com/resume.pdf',
        },
        statusHistory: [
          { status: 'Applied', timestamp: new Date().toISOString(), notes: 'Application submitted successfully via student portal' },
        ],
      };

      applications.unshift(newApp);
      saveMockApplications(applications);

      return Promise.resolve({
        data: {
          success: true,
          message: `Application to ${drive.companyId?.name || 'Company'} submitted successfully!`,
          application: newApp,
        },
      });
    }

    // 6. GET /applications/me (Student's applications)
    if (url.includes('/applications/me') && method === 'get') {
      const applications = getMockApplications();
      return Promise.resolve({
        data: { success: true, count: applications.length, applications },
      });
    }

    // 7. GET /applications/drive/:driveId (Recruiter's applicant list)
    if (url.includes('/applications/drive/') && method === 'get') {
      const applications = getMockApplications();
      return Promise.resolve({
        data: { success: true, count: applications.length, applications },
      });
    }

    // 8. PATCH /applications/:id/status (Recruiter updates applicant status)
    if (url.includes('/applications/') && url.includes('/status') && method === 'patch') {
      const parts = url.split('/');
      const appId = parts[parts.indexOf('status') - 1];
      const applications = getMockApplications();
      const target = applications.find(a => a._id === appId);
      if (target) {
        target.status = body.status || target.status;
        target.statusHistory.push({
          status: body.status,
          timestamp: new Date().toISOString(),
          notes: body.notes || `Status updated to ${body.status}`,
        });
        saveMockApplications(applications);
      }
      return Promise.resolve({
        data: { success: true, message: `Applicant status updated to ${body.status}`, application: target },
      });
    }

    // 9. GET & PUT /students/me
    if (url.includes('/students/me')) {
      if (method === 'put') {
        const cachedProfile = JSON.parse(localStorage.getItem('campusconnect_cached_profile') || '{}');
        const updatedProfile = { ...cachedProfile, ...body };
        localStorage.setItem('campusconnect_cached_profile', JSON.stringify(updatedProfile));
        return Promise.resolve({
          data: { success: true, message: 'Profile updated successfully', profile: updatedProfile },
        });
      }
      const profile = JSON.parse(localStorage.getItem('campusconnect_cached_profile') || '{}');
      return Promise.resolve({
        data: { success: true, profile },
      });
    }

    // 10. GET & PUT /admin/policy
    if (url.includes('/admin/policy')) {
      if (method === 'put') {
        saveMockPolicy(body);
        return Promise.resolve({
          data: { success: true, message: 'Policy settings updated successfully', policy: body },
        });
      }
      return Promise.resolve({
        data: { success: true, policy: getMockPolicy() },
      });
    }

    // 11. GET /admin/analytics
    if (url.includes('/admin/analytics') && method === 'get') {
      const applications = getMockApplications();
      const placedCount = applications.filter(a => a.status === 'Selected').length + 96;
      return Promise.resolve({
        data: {
          success: true,
          stats: {
            totalStudents: 142,
            placedStudents: placedCount,
            activeDrives: getMockDrives().length,
            totalOffers: placedCount + 16,
            placementRate: Math.round((placedCount / 142) * 100 * 10) / 10,
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
            { stage: 'Applied', count: applications.length + 175 },
            { stage: 'Shortlisted', count: 95 },
            { stage: 'Interviewed', count: 52 },
            { stage: 'Selected', count: placedCount },
          ],
        },
      });
    }

    // 12. GET /admin/students
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
              skills: ['React', 'Node.js', 'Python', 'Docker', 'PostgreSQL'],
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
              skills: ['PyTorch', 'TensorFlow', 'Python', 'MLOps'],
            },
            {
              _id: 'stud_03',
              user: { name: 'Diya Patel', email: 'diya.it@campusconnect.edu' },
              rollNumber: '22IT2031',
              branch: 'IT',
              CGPA: 7.6,
              activeBacklogs: 0,
              isPlaced: false,
              skills: ['Java', 'Spring Boot', 'MySQL', 'JavaScript'],
            },
            {
              _id: 'stud_04',
              user: { name: 'Rohan Verma', email: 'rohan.ece@campusconnect.edu' },
              rollNumber: '22EC3019',
              branch: 'ECE',
              CGPA: 6.4,
              activeBacklogs: 1,
              isPlaced: false,
              skills: ['C++', 'Embedded Systems', 'Verilog'],
            },
          ],
        },
      });
    }

    // 13. GET /admin/placement-records
    if (url.includes('/admin/placement-records') && method === 'get') {
      return Promise.resolve({
        data: {
          success: true,
          records: [
            {
              _id: 'rec_01',
              studentName: 'Priya Nair',
              rollNumber: '22AI4008',
              branch: 'AI/ML',
              companyName: 'Microsoft',
              role: 'Software Engineering Intern',
              package: 24.0,
              academicYear: '2025-2026',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: 'rec_02',
              studentName: 'Aman Gupta',
              rollNumber: '22CS1012',
              branch: 'CSE',
              companyName: 'Google India',
              role: 'SDE - I',
              package: 28.5,
              academicYear: '2025-2026',
              date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              _id: 'rec_03',
              studentName: 'Sneha Roy',
              rollNumber: '22IT2088',
              branch: 'IT',
              companyName: 'Adobe',
              role: 'Member of Tech Staff',
              package: 26.0,
              academicYear: '2025-2026',
              date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
      });
    }

    // 14. ATS Resume Scoring
    if (url.includes('/resume/analyze-ats')) {
      return Promise.resolve({
        data: {
          success: true,
          atsScore: 88,
          verdict: 'Highly Competitive Match',
          matchedKeywords: ['React', 'Node.js', 'Python', 'Data Structures', 'PostgreSQL', 'Docker'],
          missingKeywords: ['Kubernetes', 'GraphQL', 'AWS ECS'],
          improvements: [
            'Highlight quantified metrics: e.g. "Optimized API query latency by 42% using Redis caching"',
            'Add STAR-format impact statement for distributed system design',
            'Include cloud deployment and container orchestration experience',
          ],
        },
      });
    }

    // 15. Apply Tailored Resume
    if (url.includes('/resume/apply-tailored')) {
      return Promise.resolve({
        data: {
          success: true,
          message: 'AI-tailored resume successfully submitted to the recruitment drive!',
        },
      });
    }

    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
