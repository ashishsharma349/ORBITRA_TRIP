import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Building2, Train as TrainLucide, Compass } from 'lucide-react';

// Wander Compass Logo
export const WanderLogo = ({ className = "h-9 w-9", textClass = "text-2xl font-bold font-serif text-[#1D3B3A]" }) => (
  <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="#1D3B3A" strokeWidth="3.5" fill="#FAF8F3"/>
      <circle cx="50" cy="50" r="40" stroke="#C8BFA9" strokeWidth="1.5" strokeDasharray="3 3"/>
      <path d="M50 5 V11 M50 89 V95 M5 50 H11 M89 50 H95" stroke="#1D3B3A" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50 16 L58 46 L50 42 L42 46 Z" fill="#D97706" />
      <path d="M50 84 L58 54 L50 58 L42 54 Z" fill="#1D3B3A" />
      <circle cx="50" cy="50" r="4" fill="#FAF8F3" stroke="#1D3B3A" strokeWidth="2"/>
    </svg>
    <span className={textClass}>Wander</span>
  </Link>
);

// Flight Node Icon
export const FlightIcon = ({ className = "h-5 w-5 text-[#1D3B3A]" }) => (
  <Plane className={className} strokeWidth={1.5} />
);

// Hotel Node Icon
export const HotelIcon = ({ className = "h-5 w-5 text-[#D97706]" }) => (
  <Building2 className={className} strokeWidth={1.5} />
);

// Train Node Icon
export const TrainIcon = ({ className = "h-5 w-5 text-[#059669]" }) => (
  <TrainLucide className={className} strokeWidth={1.5} />
);

// Activity Compass Icon
export const ActivityIcon = ({ className = "h-5 w-5 text-[#7C3AED]" }) => (
  <Compass className={className} strokeWidth={1.5} />
);

// Stamp Badge Component
export const StampBadge = ({ text = "JOURNEYS", className = "" }) => (
  <div className={`inline-flex items-center justify-center border-2 border-dashed border-[#D97706]/60 rounded-md px-3.5 py-1 bg-[#FFFDF9] transform -rotate-3 text-xs font-bold tracking-wider text-[#B45309] shadow-sm ${className}`}>
    {text}
  </div>
);

// GitHub Icon
export const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

// LinkedIn Icon
export const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// SVG Illustration: Hand-drawn tickets
export const DocumentStackIllustration = () => (
  <svg className="w-24 h-20" viewBox="0 0 120 100" fill="none">
    <rect x="20" y="15" width="60" height="70" rx="6" fill="#FDFBF7" stroke="#334155" strokeWidth="2" transform="rotate(-8 50 50)"/>
    <path d="M28 28h35M28 38h40M28 48h25" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" transform="rotate(-8 50 50)"/>
    <rect x="40" y="20" width="60" height="70" rx="6" fill="#FFFFFF" stroke="#1D3B3A" strokeWidth="2.5" transform="rotate(4 70 55)"/>
    <rect x="50" y="32" width="40" height="24" rx="4" fill="#E8F3F1" stroke="#1D3B3A" strokeWidth="1.5" transform="rotate(4 70 55)"/>
    <text x="56" y="48" fill="#1D3B3A" fontSize="11" fontWeight="bold" fontFamily="sans-serif" transform="rotate(4 70 55)">PDF</text>
  </svg>
);

// SVG Illustration: AI Extraction Brain
export const AIExtractionIllustration = () => (
  <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="32" fill="#FAF5ED" stroke="#D97706" strokeWidth="2" strokeDasharray="4 4"/>
    <path d="M30 25C25 25 22 30 22 35C22 42 27 45 30 55C33 55 35 52 38 52" stroke="#1D3B3A" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M50 25C55 25 58 30 58 35C58 42 53 45 50 55C47 55 45 52 42 52" stroke="#1D3B3A" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="30" cy="25" r="3" fill="#D97706"/>
    <circle cx="50" cy="25" r="3" fill="#D97706"/>
    <circle cx="22" cy="35" r="3" fill="#059669"/>
    <circle cx="58" cy="35" r="3" fill="#059669"/>
    <circle cx="40" cy="40" r="4" fill="#1D3B3A"/>
  </svg>
);

// SVG Illustration: Map and Share
export const MapShareIllustration = () => (
  <svg className="w-24 h-20" viewBox="0 0 120 100" fill="none">
    <rect x="15" y="20" width="85" height="60" rx="8" fill="#F4EFE6" stroke="#1D3B3A" strokeWidth="2"/>
    <path d="M25 30Q45 50 65 35T90 55" stroke="#D97706" strokeWidth="2" strokeDasharray="3 3"/>
    <circle cx="25" cy="30" r="4" fill="#059669"/>
    <circle cx="90" cy="55" r="4" fill="#DC2626"/>
    <rect x="55" y="45" width="40" height="28" rx="4" fill="#FFFFFF" stroke="#1D3B3A" strokeWidth="2"/>
    <path d="M55 45L75 62L95 45" stroke="#1D3B3A" strokeWidth="2"/>
  </svg>
);

// Pagoda / Fujisan Landscape SVG Accent
export const PagodaLandscapeIllustration = ({ className = "w-48 h-28" }) => (
  <svg className={className} viewBox="0 0 220 130" fill="none">
    {/* Mt Fuji Background */}
    <path d="M70 100 L125 30 L180 100 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
    <path d="M112 46 L125 30 L138 46 Z" fill="#FFFFFF"/>
    {/* Pagoda Roofs */}
    <path d="M15 100 H55 L50 88 H20 Z" fill="#1D3B3A"/>
    <path d="M18 88 H52 L47 78 H23 Z" fill="#1D3B3A"/>
    <path d="M21 78 H49 L45 68 H25 Z" fill="#1D3B3A"/>
    <path d="M35 68 V58" stroke="#1D3B3A" strokeWidth="2.5"/>
    {/* Cherry Blossom Trees */}
    <circle cx="75" cy="92" r="14" fill="#FCA5A5" opacity="0.6"/>
    <circle cx="92" cy="95" r="11" fill="#F87171" opacity="0.5"/>
    <path d="M0 100 C60 95 160 95 220 100 V130 H0 Z" fill="#FAF8F3"/>
  </svg>
);

// Detailed Japan & East Asia Map Graphic
export const JapanMapGraphic = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ocean Background with subtle wave lines */}
    <rect width="400" height="240" fill="#EAF3F5" rx="16" />
    <path d="M20 30 Q 60 25 100 30 M280 170 Q 320 165 360 170" stroke="#D0E3E8" strokeWidth="1.5" />
    <path d="M150 180 Q 190 175 230 180 M50 110 Q 90 105 130 110" stroke="#D0E3E8" strokeWidth="1.5" />

    {/* Map Latitude & Longitude Grid Lines */}
    <path d="M0 60 H400 M0 120 H400 M0 180 H400" stroke="#D9E8EC" strokeWidth="1" strokeDasharray="4 4" />
    <path d="M100 0 V240 M200 0 V240 M300 0 V240" stroke="#D9E8EC" strokeWidth="1" strokeDasharray="4 4" />

    {/* East Asian Mainland (China / Korea coastline) */}
    <path
      d="M-20 200 C30 180 50 150 60 120 C70 90 60 60 50 20 L-20 20 Z"
      fill="#F5EFE6"
      stroke="#DCD2C2"
      strokeWidth="2"
    />
    {/* Korean Peninsula */}
    <path
      d="M60 90 C75 95 85 110 80 130 C75 140 65 145 55 135 C50 120 55 100 60 90 Z"
      fill="#F5EFE6"
      stroke="#DCD2C2"
      strokeWidth="2"
    />

    {/* Japan Islands Chain */}
    {/* Hokkaido */}
    <path
      d="M260 30 C280 25 310 35 300 55 C290 65 270 60 255 45 Z"
      fill="#FAF4E8"
      stroke="#D8CBBA"
      strokeWidth="2"
    />
    {/* Honshu (Main Island) */}
    <path
      d="M255 55 C240 70 220 90 240 110 C250 120 230 135 210 145 C190 155 170 150 150 140 C140 135 155 125 175 120 C195 115 210 100 225 80 C235 65 245 50 255 55 Z"
      fill="#FAF4E8"
      stroke="#D8CBBA"
      strokeWidth="2"
    />
    {/* Kyushu & Shikoku */}
    <path
      d="M140 145 C130 150 125 165 135 175 C145 180 155 170 150 155 Z"
      fill="#FAF4E8"
      stroke="#D8CBBA"
      strokeWidth="2"
    />
    <path
      d="M175 142 C185 140 195 148 188 155 C180 160 170 152 175 142 Z"
      fill="#FAF4E8"
      stroke="#D8CBBA"
      strokeWidth="2"
    />

    {/* Fujisan Mountain Icon */}
    <path d="M210 115 L218 102 L226 115 Z" fill="#CBD5E1" />
    <path d="M216 106 L218 102 L220 106 Z" fill="#FFFFFF" />

    {/* Animated / Curved Route Lines */}
    <path
      d="M40 160 Q 140 40 235 105"
      stroke="#1D3B3A"
      strokeWidth="2.5"
      strokeDasharray="6 6"
      fill="none"
    />
    <path
      d="M235 105 Q 210 130 185 142"
      stroke="#D97706"
      strokeWidth="2"
      strokeDasharray="4 4"
      fill="none"
    />

    {/* Airplane Marker on Route Line */}
    <g transform="translate(145, 75) rotate(-15)">
      <path d="M12 2 L15 9 L22 11 L15 13 L12 20 L9 13 L2 11 L9 9 Z" fill="#1D3B3A" />
    </g>

    {/* Pins & Labels */}
    {/* Delhi Pin */}
    <g transform="translate(40, 160)">
      <circle cx="0" cy="0" r="7" fill="#1D3B3A" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
      <text x="-12" y="18" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Delhi</text>
    </g>

    {/* Tokyo Pin */}
    <g transform="translate(235, 105)">
      <path d="M0 -14 C-5 -14 -9 -10 -9 -5 C-9 2 0 10 0 10 C0 10 9 2 9 -5 C9 -10 5 -14 0 -14 Z" fill="#D97706" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="0" cy="-5" r="3" fill="#FFFFFF" />
      <text x="12" y="-2" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Tokyo</text>
    </g>

    {/* Kyoto Pin */}
    <g transform="translate(185, 142)">
      <path d="M0 -14 C-5 -14 -9 -10 -9 -5 C-9 2 0 10 0 10 C0 10 9 2 9 -5 C9 -10 5 -14 0 -14 Z" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="0" cy="-5" r="3" fill="#FFFFFF" />
      <text x="12" y="2" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Kyoto</text>
    </g>

    {/* Vintage Compass Rose Accent (Bottom Right) */}
    <g transform="translate(345, 185) scale(0.8)">
      <circle cx="0" cy="0" r="22" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4 Z" fill="#1D3B3A" />
      <path d="M0 -18 L4 -4 L0 0 L-4 -4 Z" fill="#D97706" />
      <circle cx="0" cy="0" r="3" fill="#FFFDF9" />
      <text x="-3" y="-22" fill="#64748B" fontSize="8" fontWeight="bold">N</text>
    </g>
  </svg>
);

