import React from 'react';

interface LogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
}

// Reusable SVG Symbol (Shield + Cross + Human Figure + Green Heart)
export function MyDoctorSymbol({ className = "w-12 h-12", width, height }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      className={className}
      width={width}
      height={height}
      fill="none"
    >
      <defs>
        {/* Blue Gradient for bottom-left shield outline & cross */}
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#258dbd" />
          <stop offset="50%" stopColor="#1a6e9a" />
          <stop offset="100%" stopColor="#145277" />
        </linearGradient>
        
        {/* Sky Blue to Greenish Gradient for cross highlight */}
        <linearGradient id="crossGrad" x1="0%" y1="30%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4bc0e8" />
          <stop offset="60%" stopColor="#259ec1" />
          <stop offset="100%" stopColor="#1f83a5" />
        </linearGradient>

        {/* Green/Mint Gradient for the right shield arc */}
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8ee3bc" />
          <stop offset="50%" stopColor="#67cca4" />
          <stop offset="100%" stopColor="#41b28d" />
        </linearGradient>

        {/* Light Green gradient for the chest heart */}
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#82e6bb" />
          <stop offset="100%" stopColor="#51cc9b" />
        </linearGradient>
      </defs>

      {/* 1. Left/Bottom Blue Shield Outer Arc */}
      <path
        d="M 143 318 C 143 318 170 358 200 358 C 230 358 257 318 257 318 C 215 342 185 342 143 318 Z"
        fill="url(#blueGrad)"
      />
      
      {/* 2. Blue Shield left-bottom wing */}
      <path
        d="M 143 318 C 122 290 120 250 120 230 C 120 230 145 230 152 255 C 158 276 174 294 195 304 C 180 295 168 280 162 260 C 153 230 143 190 160 170 C 170 160 185 155 200 155"
        stroke="url(#blueGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. The Blue Medical Cross (Left Side) */}
      <path
        d="M 160 175 L 120 175 C 105 175 100 180 100 195 L 100 235 C 100 250 105 255 120 255 L 140 255 L 140 275 C 140 290 145 295 160 295 L 190 295 C 190 275 180 255 170 235 C 160 215 155 195 160 175 Z"
        fill="url(#crossGrad)"
      />
      <path
        d="M 160 175 L 160 135 C 160 120 165 115 180 115 L 205 115 C 205 130 195 150 180 165 L 160 175 Z"
        fill="url(#crossGrad)"
      />

      {/* 4. Right Side Green Shield Arc */}
      <path
        d="M 205 119 C 230 122 270 135 295 160 C 315 180 310 240 290 280 C 275 310 250 335 220 348 C 235 330 255 305 265 280 C 278 245 285 195 265 175 C 250 160 225 152 205 150"
        fill="url(#greenGrad)"
      />

      {/* 5. Center Human Figure - Circle Head */}
      <circle cx="202" cy="170" r="22" fill="url(#crossGrad)" />

      {/* 6. Center Human Figure - Body & Swooping Arms */}
      {/* Swooping white arms/body that creates the negative space over the cross */}
      <path
        d="M 145 231 C 180 231 190 242 200 262 C 210 282 220 302 245 302 C 270 302 285 270 295 240 C 285 265 270 285 250 285 C 230 285 222 270 212 250 C 202 230 185 218 145 218 Z"
        fill="white"
      />
      <path
        d="M 200 215 C 235 200 265 185 290 150 C 275 175 245 195 215 205 L 200 215 Z"
        fill="white"
      />

      {/* 7. Light Green Heart on Chest */}
      <path
        d="M 205 250 C 201 245 194 245 191 249 C 188 253 190 260 196 265 L 205 273 L 214 265 C 220 260 222 253 219 249 C 216 245 209 245 205 250 Z"
        fill="url(#heartGrad)"
      />
    </svg>
  );
}

// Logo 1: Horizontal design (Symbol + "mydoctor" text)
// Used in the top navbar / header
export function Logo1({ className = "h-12", textClassName = "text-teal-950" }: { className?: string; textClassName?: string }) {
  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {/* Scale down Symbol for inline use */}
      <MyDoctorSymbol className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" />
      <span className={`text-xl sm:text-2xl font-black tracking-tight ${textClassName}`} style={{ fontFamily: 'sans-serif' }}>
        <span style={{ color: '#1a6f9a' }}>my</span>
        <span style={{ color: '#135176' }}>doctor</span>
      </span>
    </div>
  );
}

// Logo 2: Centered layout (Centered Symbol + Centered stylized text "MyDoctor" and "ใส่ใจทุกชีวิต")
// Used in the middle of the landing/login screen and center of dashboard
export function Logo2({ className = "flex flex-col items-center text-center py-4" }: { className?: string }) {
  return (
    <div className={className} id="mydoctor_centered_logo">
      {/* Medium size centered icon */}
      <MyDoctorSymbol className="w-28 h-28 sm:w-36 sm:h-36 mb-4 drop-shadow-sm" />
      
      {/* Styled Brand Slogan text */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
        <span className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#258dbd', fontFamily: 'sans-serif' }}>
          “MyDoctor
        </span>
        <span className="text-xl sm:text-2xl font-bold tracking-normal" style={{ color: '#41b28d', fontFamily: 'sans-serif' }}>
          ใส่ใจทุกชีวิต”
        </span>
      </div>
    </div>
  );
}
