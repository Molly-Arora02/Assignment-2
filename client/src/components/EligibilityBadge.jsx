import React, { useState } from 'react';
import { CheckCircle2, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

const EligibilityBadge = ({ isEligible, reasons = [], details = {} }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="inline-block text-left">
      <div className="flex items-center gap-2">
        {isEligible ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Eligible to Apply
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Not Eligible
          </span>
        )}

        {reasons.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 underline decoration-dotted transition-colors"
          >
            <span>{showDetails ? 'Hide details' : 'Why?'}</span>
            {showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {showDetails && reasons.length > 0 && (
        <div className="mt-2.5 p-3 bg-rose-50/90 border border-rose-200 rounded-xl text-xs text-rose-900 shadow-md max-w-sm animate-in fade-in duration-200">
          <p className="font-bold mb-1.5 flex items-center gap-1 text-rose-800">
            <Info className="w-3.5 h-3.5 text-rose-600" />
            Eligibility Criteria Mismatch:
          </p>
          <ul className="space-y-1 list-disc list-inside text-rose-700/90">
            {reasons.map((reason, idx) => (
              <li key={idx} className="leading-snug">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EligibilityBadge;
