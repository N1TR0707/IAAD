// Logo IAAD - heksagon gradient biru-teal-hijau (gaya brand IAAD Project).
// Dipakai sebagai logo bawaan bila belum ada logo yang diupload.
const IaadLogo = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="iaadGrad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0e7490" />
        <stop offset="55%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <g stroke="url(#iaadGrad)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      {/* Heksagon luar */}
      <polygon points="50,8 87,29 87,71 50,92 13,71 13,29" />
      {/* Segitiga atas */}
      <polygon points="50,22 74,64 26,64" />
      {/* Lingkaran/lensa dalam */}
      <circle cx="50" cy="56" r="20" />
      {/* Garis vertikal tengah */}
      <line x1="50" y1="22" x2="50" y2="76" />
    </g>
  </svg>
);

export default IaadLogo;
