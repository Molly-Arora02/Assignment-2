import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CompanyLogo from '../../components/CompanyLogo';
import {
  Users,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  Award,
} from 'lucide-react';

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [placedFilter, setPlacedFilter] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/students');
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (e) {
      console.error('Failed to load student directory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const nameMatch =
      s.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase());

    const branchMatch = !branchFilter || s.branch === branchFilter;
    const placedMatch =
      !placedFilter || (placedFilter === 'placed' ? s.isPlaced : !s.isPlaced);

    return nameMatch && branchMatch && placedMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Student Placement Database</h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete institution roster of registered students with live academic performance and
          placement status.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="AI/ML">AI/ML</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="ME">ME</option>
        </select>

        <select
          value={placedFilter}
          onChange={(e) => setPlacedFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Placement Status (All)</option>
          <option value="placed">Placed Only</option>
          <option value="unplaced">Unplaced Only</option>
        </select>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading student directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No students matched the filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Roll No & Student</th>
                  <th className="px-6 py-3.5">Branch & Batch</th>
                  <th className="px-6 py-3.5">CGPA</th>
                  <th className="px-6 py-3.5">Backlogs</th>
                  <th className="px-6 py-3.5">Placement Status</th>
                  <th className="px-6 py-3.5 text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{s.userId?.name}</p>
                      <p className="text-slate-500 text-[11px]">{s.userId?.email}</p>
                      <span className="font-mono text-[10px] text-brand-700 font-bold">
                        {s.rollNumber}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{s.branch}</span>
                      <p className="text-[10px] text-slate-400">Batch {s.graduationYear}</p>
                    </td>

                    <td className="px-6 py-4 font-black text-brand-700 text-sm">{s.CGPA}</td>

                    <td className="px-6 py-4">
                      {s.activeBacklogs === 0 ? (
                        <span className="text-emerald-600 font-bold">0</span>
                      ) : (
                        <span className="text-rose-600 font-bold">{s.activeBacklogs}</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {s.isPlaced ? (
                        <div className="flex items-center space-x-2">
                          <CompanyLogo
                            name={s.placedCompanyId?.name || 'Company'}
                            logo={s.placedCompanyId?.logo}
                            size="xs"
                          />
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.2 text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 rounded-md">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Placed
                            </span>
                            <p className="text-[11px] font-bold text-slate-800">
                              {s.placedCompanyId?.name || 'Partner Company'} (₹{s.placedPackage} LPA)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Active Jobseeker
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {s.resumeUrl ? (
                        <a
                          href={s.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          <span>Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDirectory;
