import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const lastUpdate = new Date().toLocaleDateString('ko-KR');

  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-3">
            과천 지식정보타운 편의시설 가이드
          </h3>
          <p className="text-sm mb-2">
            데이터 출처: Google Sheets
          </p>
          <p className="text-sm mb-4">
            최종 업데이트: {lastUpdate}
          </p>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <p className="text-xs text-gray-400">
              © {currentYear} 과천 지식정보타운 편의시설 가이드. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              편의시설 정보는 변경될 수 있으니 방문 전 확인하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

