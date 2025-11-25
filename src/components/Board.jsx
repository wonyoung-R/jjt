import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import LoadingSpinner from './LoadingSpinner';
import BoardDetail from './BoardDetail';
import FloatingKakaoButton from './FloatingKakaoButton';
import SubmitInfoModal from './SubmitInfoModal';

const BOARD_CSV_URL = 
  'https://docs.google.com/spreadsheets/d/1K8o5dOzYdmYOZEZvKalgQ7ALMweSK9LIirGxpfRtxsA/export?format=csv&gid=547248148';

function Board({ onClose }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // 다양한 컬럼명 처리를 위한 헬퍼 함수
  const getFieldValue = (post, ...fieldNames) => {
    for (const fieldName of fieldNames) {
      if (post[fieldName]) return post[fieldName];
    }
    return '';
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(BOARD_CSV_URL);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('📊 게시판 데이터 로드:', results.data);
          console.log('🔍 첫 번째 항목 키:', results.data[0] ? Object.keys(results.data[0]) : '데이터 없음');
          console.log('🔍 첫 번째 항목 전체:', results.data[0]);
          
          // 빈 행 제거 (모든 값이 비어있는 행만 제거)
          const filteredData = results.data.filter(post => {
            const values = Object.values(post);
            return values.some(val => val && val.toString().trim() !== '');
          });
          
          console.log('🎯 빈 행 제거 후:', filteredData);
          
          // 날짜 역순 정렬 (최신 글이 위로)
          const sortedPosts = filteredData.sort((a, b) => {
            const dateA = new Date(a['날짜'] || '');
            const dateB = new Date(b['날짜'] || '');
            return dateB - dateA;
          });
          console.log('✅ 필터링된 게시글:', sortedPosts);
          setPosts(sortedPosts);
          setLoading(false);
        },
        error: (error) => {
          setError('게시글을 불러오는데 실패했습니다.');
          setLoading(false);
          console.error('CSV parsing error:', error);
        }
      });
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      setLoading(false);
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedPost) {
    return (
      <BoardDetail 
        post={selectedPost} 
        onBack={() => setSelectedPost(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 카카오톡 플로팅 버튼 */}
      <FloatingKakaoButton />
      
          {/* 헤더 */}
          <div className="sticky top-0 z-50 bg-gradient-to-r from-primary-600 to-secondary-600 shadow-md">
            <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-7xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 leading-tight">
                    과천 지정타 뉴스
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90">
                    지식정보타운의 새로운 소식
                  </p>
                </div>
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <button
                    onClick={fetchPosts}
                    className="p-1.5 md:p-2 text-white hover:bg-white/20 active:scale-90 rounded-lg transition"
                    title="새로고침"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/20 text-white hover:bg-white/30 active:scale-95 rounded-lg transition font-medium text-sm md:text-base"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="hidden sm:inline">홈으로</span>
                    <span className="sm:hidden">홈</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

      {/* 본문 */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* 사장님 전용 안내 배너 */}
        <div className="mb-6 md:mb-8">
          <div 
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* 아이콘 */}
              <div className="flex-shrink-0 bg-gradient-to-br from-orange-400 to-pink-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              
              {/* 텍스트 */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>사장님! 우리 가게 알려주세요</span>
                  <span className="text-2xl">📢</span>
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">
                  <span className="font-semibold text-orange-600">신메뉴 출시</span>, <span className="font-semibold text-orange-600">할인 이벤트</span>, <span className="font-semibold text-orange-600">특별 행사</span> 등<br className="md:hidden"/>
                  지정타 직장인들에게 알리고 싶은 소식이 있으신가요?
                </p>
                <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-600">
                  <span className="px-3 py-1 bg-white rounded-full border border-orange-200">✨ 무료 홍보</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-orange-200">📱 간편 등록</span>
                  <span className="px-3 py-1 bg-white rounded-full border border-orange-200">🎯 직장인 타겟</span>
                </div>
              </div>
              
              {/* 버튼 */}
              <div className="w-full md:w-auto">
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200 text-center">
                  <span className="block md:inline">지금 바로</span>
                  <span className="block md:inline md:ml-1">알리기 👉</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              다시 시도
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">게시글이 없습니다</h3>
            <p className="text-gray-500">첫 번째 소식을 기다려주세요!</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {posts.map((post, index) => (
              <article
                key={index}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl active:scale-[0.99] transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* 썸네일 */}
                  {getFieldValue(post, '이미지1', 'Image1') && (
                    <div className="md:w-64 h-40 sm:h-48 md:h-auto overflow-hidden flex-shrink-0">
                      <img
                        src={getFieldValue(post, '이미지1', 'Image1')}
                        alt={getFieldValue(post, '제목 ', '제목', 'title', 'Title')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* 내용 */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <span className="px-2 md:px-3 py-0.5 md:py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                        NEWS
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">
                        {formatDate(getFieldValue(post, '날짜', 'date', 'Date'))}
                      </span>
                      {getFieldValue(post, '작성자', 'author', 'Author') && (
                        <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">
                          · {getFieldValue(post, '작성자', 'author', 'Author')}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {getFieldValue(post, '제목 ', '제목', 'title', 'Title') || '제목 없음'}
                    </h2>
                    
                    {getFieldValue(post, '컨텐츠 ', '컨텐츠', 'content', 'Content') && (
                      <p className="text-sm md:text-base text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed">
                        {getFieldValue(post, '컨텐츠 ', '컨텐츠', 'content', 'Content')}
                      </p>
                    )}
                    
                    <div className="mt-3 md:mt-4 flex items-center text-primary-600 font-medium text-sm md:text-base group-hover:translate-x-2 transition-transform">
                      자세히 보기
                      <svg className="w-4 h-4 md:w-5 md:h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 정보 제출 모달 */}
      <SubmitInfoModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
      />
    </div>
  );
}

export default Board;

