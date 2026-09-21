import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  DownloadCloud,
  FileSpreadsheet,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const PlacementReports = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/placement-records');
      if (data.success) {
        setRecords(data.records || []);
      }
    } catch (e) {
      console.error('Failed to load placement records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDownloadCSV = () => {
    window.open('/api/admin/export-csv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Placement Reports & Accreditations</h1>
          <p className="text-sm text-slate-600 mt-1">
            Official verified placement records ready for export to spreadsheet format.
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Verified Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading placement reports...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No confirmed placement records yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Records will appear automatically when candidates are marked "Selected".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Roll No & Student</th>
                  <th className="px-6 py-3.5">Branch</th>
                  <th className="px-6 py-3.5">Hiring Partner</th>
                  <th className="px-6 py-3.5">Designation</th>
                  <th className="px-6 py-3.5">Package</th>
                  <th className="px-6 py-3.5">Academic Year</th>
                  <th className="px-6 py-3.5 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{rec.studentId?.name}</p>
                      <p className="font-mono text-[10px] text-brand-700 font-bold">
                        {rec.studentProfileId?.rollNumber || 'N/A'}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">
                        {rec.studentProfileId?.branch || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-600" />
                        {rec.companyId?.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">{rec.role}</span>
                      <p className="text-[10px] text-slate-400">{rec.placementType}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-black text-emerald-600 text-sm">
                        ₹{rec.package} LPA
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">{rec.academicYear}</td>

                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
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

export default PlacementReports;
