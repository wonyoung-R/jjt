import React from 'react';

function PlaceholderLogo({ className = "w-32 h-32" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 왼쪽 날개 (청록색) */}
      <path
        d="M60 80 C40 80, 30 90, 30 110 C30 130, 40 145, 60 150 L70 130 C65 125, 60 120, 60 110 C60 100, 65 95, 70 90 Z"
        fill="#26C6B8"
      />
      
      {/* 오른쪽 날개 (파란색) */}
      <path
        d="M140 80 C160 80, 170 90, 170 110 C170 130, 160 145, 140 150 L130 130 C135 125, 140 120, 140 110 C140 100, 135 95, 130 90 Z"
        fill="#1890FF"
      />
      
      {/* 중앙 화살표 */}
      <path
        d="M100 70 L100 150 M90 60 L100 50 L110 60"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* 연결선들 (상단) */}
      <circle cx="85" cy="40" r="4" fill="#1890FF" />
      <line x1="85" y1="40" x2="100" y2="60" stroke="#1890FF" strokeWidth="2" />
      
      <circle cx="100" cy="30" r="4" fill="#F5A623" />
      <line x1="100" y1="30" x2="100" y2="60" stroke="#F5A623" strokeWidth="2" />
      
      <circle cx="115" cy="40" r="4" fill="#1890FF" />
      <line x1="115" y1="40" x2="100" y2="60" stroke="#1890FF" strokeWidth="2" />
      
      {/* 중앙 연결선들 */}
      <circle cx="75" cy="55" r="3" fill="#F5A623" />
      <line x1="75" y1="55" x2="90" y2="70" stroke="#F5A623" strokeWidth="2" />
      
      <circle cx="90" cy="50" r="3" fill="#26C6B8" />
      <line x1="90" y1="50" x2="95" y2="65" stroke="#26C6B8" strokeWidth="2" />
      
      <circle cx="110" cy="50" r="3" fill="#26C6B8" />
      <line x1="110" y1="50" x2="105" y2="65" stroke="#26C6B8" strokeWidth="2" />
      
      <circle cx="125" cy="55" r="3" fill="#F5A623" />
      <line x1="125" y1="55" x2="110" y2="70" stroke="#F5A623" strokeWidth="2" />
      
      {/* 하단 주황색 파동 */}
      <path
        d="M50 140 Q60 135 70 140 Q80 145 90 140 Q100 135 110 140 Q120 145 130 140 Q140 135 150 140"
        stroke="#F5A623"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M55 150 Q65 146 75 150 Q85 154 95 150 Q105 146 115 150 Q125 154 135 150 Q145 146 155 150"
        stroke="#F5A623"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default PlaceholderLogo;

