import React from 'react';
import { CheckCircle2, Clock, XCircle, User, Calendar } from 'lucide-react';

const stages = ['Applied', 'Shortlisted', 'Interviewed', 'Selected'];

const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const isRejected = currentStatus === 'Rejected';
  const currentIndex = stages.indexOf(currentStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'text-emerald-700 bg-emerald-100 border-emerald-300';
      case 'Interviewed':
        return 'text-purple-700 bg-purple-100 border-purple-300';
      case 'Shortlisted':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'Applied':
        return 'text-amber-700 bg-amber-100 border-amber-300';
      case 'Rejected':
        return 'text-rose-700 bg-rose-100 border-rose-300';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Step Bar */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full -z-0" />
        {stages.map((stage, idx) => {
          const isPassed = !isRejected && currentIndex >= idx;
          const isCurrent = !isRejected && currentStatus === stage;

          return (
            <div key={stage} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isPassed
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30 ring-4 ring-brand-100'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                } ${isCurrent ? 'scale-110 ring-4 ring-brand-300' : ''}`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`text-xs font-semibold mt-1.5 ${
                  isPassed ? 'text-brand-900' : 'text-slate-400'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rejected Alert Banner if Rejected */}
      {isRejected && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>Application was not selected during this recruitment cycle.</span>
        </div>
      )}

      {/* Audit History Logs */}
      {statusHistory.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Timeline History
          </p>
          <div className="space-y-2">
            {statusHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <User className="w-3 h-3" /> {item.role || 'System'}
                    </span>
                  </div>
                  {item.notes && <p className="text-slate-700 font-medium">{item.notes}</p>}
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTimeline;
