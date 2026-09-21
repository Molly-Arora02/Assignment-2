import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Sliders,
  Shield,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Sparkles,
} from 'lucide-react';

const PolicySettings = () => {
  const [policy, setPolicy] = useState({
    enabled: true,
    allowDreamUpgrade: true,
    dreamMultiplier: 1.5,
    maxBacklogsAllowedInstitutionWide: 2,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const { data } = await api.get('/admin/policy');
        if (data.success && data.policy) {
          setPolicy(data.policy);
        }
      } catch (e) {
        console.error('Failed to load policy settings:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleToggle = (field) => {
    setPolicy({ ...policy, [field]: !policy[field] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { data } = await api.put('/admin/policy', policy);
      if (data.success) {
        setMessage('Placement policy rules have been updated and enforced across the system!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update policy settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Placement Policy Engine Configuration</h1>
        <p className="text-sm text-slate-600 mt-1">
          Define institutional placement guidelines to prevent job offer hoarding and ensure fair
          opportunity distribution across candidates.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Policy Rule 1: Single Offer Policy */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Single-Offer Placement Lock (1-Offer Rule)
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                Once a student's application status is marked as "Selected" for a full-time placement
                drive, they are automatically blocked from submitting new applications.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('enabled')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                policy.enabled ? 'bg-brand-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  policy.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Policy Rule 2: Dream Company Upgrade Multiplier */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Allow Dream Offer Upgrades
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                Permits already selected students to apply ONLY if the new drive package meets or
                exceeds the multiplier threshold of their current offer.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('allowDreamUpgrade')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                policy.allowDreamUpgrade ? 'bg-brand-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  policy.allowDreamUpgrade ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Multiplier Value */}
          {policy.allowDreamUpgrade && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Dream Offer Multiplier (e.g. 1.5x of previous CTC)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.1"
                max="5.0"
                value={policy.dreamMultiplier}
                onChange={(e) =>
                  setPolicy({ ...policy, dreamMultiplier: Number(e.target.value) })
                }
                className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400">
                Example: If placed at ₹10 LPA, student can only apply to drives with package &ge; ₹
                {(10 * (policy.dreamMultiplier || 1.5)).toFixed(1)} LPA.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Placement Policies</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PolicySettings;
