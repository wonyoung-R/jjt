import React from 'react';
import FloatingKakaoButton from './FloatingKakaoButton';

function BoardDetail({ post, onBack, onClose }) {
  // 다양한 컬럼명 처리를 위한 헬퍼 함수
  const getFieldValue = (post, ...fieldNames) => {
    for (const fieldName of fieldNames) {
      if (post[fieldName]) return post[fieldName];
    }
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const images = [
    getFieldValue(post, '이미지1', 'Image1'),
    getFieldValue(post, '이미지2', 'Image2'),
    getFieldValue(post, '이미지3', 'Image3'),
    getFieldValue(post, '이미지4', 'Image4'),
    getFieldValue(post, '이미지5', 'Image5')
  ].filter(img => img && img.trim() !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 카카오톡 플로팅 버튼 */}
      <FloatingKakaoButton />
      
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              목록으로
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 메타 정보 */}
          <div className="px-6 md:px-10 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
              NEWS
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(getFieldValue(post, '날짜', 'date', 'Date'))}
            </span>
            {getFieldValue(post, '작성자', 'author', 'Author') && (
              <span className="text-sm text-gray-500">
                · {getFieldValue(post, '작성자', 'author', 'Author')}
              </span>
            )}
          </div>
          
          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {getFieldValue(post, '제목 ', '제목', 'title', 'Title') || '제목 없음'}
          </h1>
          </div>

          {/* 대표 이미지 */}
          {images.length > 0 && (
            <div className="mb-8">
              <img
                src={images[0]}
                alt={getFieldValue(post, '제목 ', '제목', 'title', 'Title')}
                className="w-full max-h-96 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* 본문 내용 */}
          <div className="px-6 md:px-10 pb-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {getFieldValue(post, '컨텐츠 ', '컨텐츠', 'content', 'Content')}
              </p>
            </div>

            {/* 추가 이미지들 */}
            {images.length > 1 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.slice(1).map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={image}
                      alt={`${getFieldValue(post, '제목 ', '제목', 'title', 'Title')} - 이미지 ${index + 2}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="px-6 md:px-10 pb-8 border-t border-gray-200 pt-6 mt-8">
            <button
              onClick={onBack}
              className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              목록으로 돌아가기
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}

export default BoardDetail;

