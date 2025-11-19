import React, { useState, useEffect } from 'react';

function FloatingKakaoButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 후 약간의 딜레이를 두고 표시
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open('https://open.kakao.com/o/p9eehzXh', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <button
        onClick={handleClick}
        className="group relative bg-white hover:bg-gray-50 rounded-full p-2 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2"
        aria-label="카카오톡 오픈채팅방"
      >
        {/* 카카오톡 이미지 */}
        <img
          src="/images/kakao.png"
          alt="카카오톡"
          className="w-14 h-14 object-contain"
        />

        {/* 텍스트 (데스크톱에서만 표시) */}
        <span className="hidden md:block font-bold text-sm text-gray-900 whitespace-nowrap pr-2">
          오픈채팅방
        </span>

        {/* 펄스 효과 */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </button>

      {/* 툴팁 */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
          과천 지정타 직장러 모임
          <div className="absolute top-full right-4 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingKakaoButton;

