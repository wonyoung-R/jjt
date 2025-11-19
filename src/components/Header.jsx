import React, { useState, useEffect } from 'react';

function Header({ onBoardClick }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-gradient-to-r from-primary-600 to-secondary-600'
      }`}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300 ${
              isScrolled ? 'text-primary-700' : 'text-white'
            }`}>
              과천 지식정보타운 편의시설 가이드
            </h1>
            <p className={`text-base md:text-lg transition-colors duration-300 ${
              isScrolled ? 'text-gray-600' : 'text-white/90'
            }`}>
              갈현동 지역 맞춤 정보
            </p>
          </div>
          
          {/* 게시판 버튼 */}
          <button
            onClick={onBoardClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isScrolled 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="hidden sm:inline">게시판</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

