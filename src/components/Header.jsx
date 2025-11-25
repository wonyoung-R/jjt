import React, { useState, useEffect } from 'react';

function Header() {
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
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 transition-colors duration-300 leading-tight ${
              isScrolled ? 'text-primary-700' : 'text-white'
            }`}>
              과천 지식정보타운의 지식정보<span className="text-yellow-500">💡</span>
            </h1>
            <p className={`text-xs sm:text-sm md:text-base lg:text-lg transition-colors duration-300 ${
              isScrolled ? 'text-gray-600' : 'text-white/90'
            }`}>
              과천 갈현동 지식정보타운 맞춤 정보
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

