import React, { useState } from 'react';

// Crisp SVG Vector Brand Icons for perfect, 100% reliable rendering
const BRAND_SVGS = {
  google: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.39 7.35 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27A7.06 7.06 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.25A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.61 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 23 23" className="w-full h-full">
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  ),
  amazon: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#FF9900" d="M13.882 17.587c-4.887 3.593-11.895 1.88-13.882 1.348 2.053 2.11 6.84 3.714 11.968 1.954 6.38-2.19 8.44-7.558 7.925-8.084-.514-.527-2.126 1.775-6.01 4.782z"/>
      <path fill="#FF9900" d="M22.093 12.355c-.563-.734-3.71-1.047-5.074-.537-.39.146-.35.597.06.697 1.344.327 3.322.25 3.322.25s-1.893 2.222-3.15 3.428c-.354.34-.143.766.27.509 1.455-.904 4.887-3.905 4.572-4.347z"/>
      <path fill="#232F3E" d="M14.908 6.94c0 2.203-1.025 3.633-2.617 4.542-1.396.797-3.21.996-4.664 1.096-.282.02-.375-.24-.13-.42 1.044-.764 2.196-1.745 2.196-3.218 0-1.838-1.127-2.67-2.67-2.67-1.762 0-3.118 1.357-3.118 3.528 0 2.502 1.758 4.34 4.417 4.34 1.488 0 2.92-.577 3.82-1.577.26-.286.66-.238.835.087l.955 1.785c.19.355.085.74-.235.992-1.517 1.196-3.415 1.782-5.463 1.782-4.218 0-7.395-2.92-7.395-7.042 0-4.04 3.09-7.14 7.21-7.14 3.972 0 6.67 2.658 6.67 6.717z"/>
    </svg>
  ),
  cisco: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#049fd9" d="M4 10.5v3h1.5v-3H4zm3-3.5v10h1.5V7H7zm3-2.5v15h1.5V4.5H10zm3 0v15h1.5V4.5H13zm3 2.5v10h1.5V7H16zm3 3.5v3h1.5v-3H19z"/>
    </svg>
  ),
  goldmansachs: (
    <div className="w-full h-full bg-[#7399C6] text-white font-bold flex items-center justify-center rounded-sm text-[10px] tracking-tighter leading-none p-0.5">
      <span>GS</span>
    </div>
  ),
  adobe: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path fill="#FA0F00" d="M13.96 4h9.04v16.5l-9.04-16.5zm-3.92 0h-9.04v16.5l9.04-16.5zm1.96 6.84 4.7 9.66h-3.48l-1.68-3.79h-2.97l2.25-4.48c.41-.82.81-1.39 1.18-1.39z"/>
    </svg>
  ),
  deloitte: (
    <div className="w-full h-full bg-slate-900 text-white font-black flex items-center justify-center rounded-sm text-[10px] tracking-tight">
      <span>D<span className="text-emerald-400">.</span></span>
    </div>
  ),
  morganstanley: (
    <div className="w-full h-full bg-[#002D62] text-white font-serif font-bold flex items-center justify-center rounded-sm text-[11px]">
      <span>MS</span>
    </div>
  ),
};

const getBrandKey = (name = '') => {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (clean.includes('google')) return 'google';
  if (clean.includes('microsoft')) return 'microsoft';
  if (clean.includes('amazon')) return 'amazon';
  if (clean.includes('cisco')) return 'cisco';
  if (clean.includes('goldman')) return 'goldmansachs';
  if (clean.includes('adobe')) return 'adobe';
  if (clean.includes('deloitte')) return 'deloitte';
  if (clean.includes('morgan')) return 'morganstanley';
  return null;
};

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const BRAND_COLORS = {
  google: 'from-blue-500/10 to-amber-500/10 border-blue-200',
  microsoft: 'from-sky-500/10 to-emerald-500/10 border-sky-200',
  amazon: 'from-amber-500/10 to-orange-500/10 border-amber-200',
  cisco: 'from-cyan-500/10 to-blue-500/10 border-cyan-200',
  goldmansachs: 'from-blue-600/10 to-slate-500/10 border-blue-300',
  adobe: 'from-rose-500/10 to-red-500/10 border-rose-200',
  deloitte: 'from-slate-800/10 to-emerald-500/10 border-slate-300',
  morganstanley: 'from-indigo-900/10 to-blue-800/10 border-indigo-200',
};

export default function CompanyLogo({
  name = 'Company',
  logo = '',
  size = 'md',
  className = '',
  showShadow = true,
}) {
  const [imgError, setImgError] = useState(false);
  const brandKey = getBrandKey(name);
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const brandBg = (brandKey && BRAND_COLORS[brandKey]) || 'from-slate-100 to-slate-200 border-slate-200';

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${brandBg} border rounded-xl p-1.5 overflow-hidden transition-all duration-200 ${
        showShadow ? 'shadow-sm hover:shadow' : ''
      } ${sizeClass} ${className}`}
      title={name}
    >
      {logo && !imgError ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-full h-full object-contain filter drop-shadow-xs"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : brandKey && BRAND_SVGS[brandKey] ? (
        <div className="w-full h-full flex items-center justify-center p-0.5">
          {BRAND_SVGS[brandKey]}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 bg-white rounded-lg shadow-xs">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
