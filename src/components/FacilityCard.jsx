import React, { useState } from 'react';
import PlaceholderLogo from './PlaceholderLogo';

function FacilityCard({ facility }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const name = facility['장소명'] || '정보 없음';
  const category = facility['대분류'] || '';
  const subCategory = facility['중분류'] || '';
  const address = facility['주소'] || '';
  const phone = facility['전화번호'] || '';
  const hours = facility['영업시간'] || '';
  const thumbnail = facility['썸네일URL'] || '';
  const kakaoMapUrl = facility['카카오맵URL'] || '';
  const menu1 = facility['대표메뉴1'] || '';
  const menu2 = facility['대표메뉴2'] || '';
  const menu3 = facility['대표메뉴3'] || '';

  const menus = [menu1, menu2, menu3].filter(menu => menu);
  const hasImage = thumbnail && !imageError;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* 썸네일 이미지 */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {hasImage ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="animate-pulse">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            <img
              src={thumbnail}
              alt={name}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <img
              src={`${import.meta.env.BASE_URL}images/placeholder.png`}
              alt="과천 지식정보타운"
              className="w-32 h-32 object-contain"
              onError={(e) => {
                // 이미지 로드 실패 시 SVG 로고 표시
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none' }}>
              <PlaceholderLogo className="w-32 h-32" />
            </div>
          </div>
        )}
        
        {/* 카테고리 뱃지 */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full shadow-lg">
            {category}
          </span>
          {subCategory && (
            <span className="px-3 py-1 bg-white/90 text-gray-700 text-xs font-semibold rounded-full shadow-lg">
              {subCategory}
            </span>
          )}
        </div>
      </div>

      {/* 카드 내용 */}
      <div className="p-5">
        {/* 장소명 */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {name}
        </h3>

        {/* 주소 */}
        {address && (
          <div className="flex items-start gap-2 mb-2 text-gray-600">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm leading-relaxed">{address}</p>
          </div>
        )}

        {/* 전화번호 */}
        {phone && (
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a
              href={`tel:${phone}`}
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
            >
              {phone}
            </a>
          </div>
        )}

        {/* 영업시간 */}
        {hours && (
          <div className="flex items-start gap-2 mb-3">
            <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-600 leading-relaxed">{hours}</p>
          </div>
        )}

        {/* 대표 메뉴 */}
        {menus.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              대표 메뉴
            </h4>
            <div className="flex flex-wrap gap-2">
              {menus.map((menu, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary-50 text-secondary-700 text-xs font-medium rounded-full"
                >
                  {menu}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 카카오맵 링크 */}
        {kakaoMapUrl && (
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            카카오맵에서 보기
          </a>
        )}
      </div>
    </div>
  );
}

export default FacilityCard;

