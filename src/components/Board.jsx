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
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                과천 지정타 뉴스
              </h1>
              <p className="text-base md:text-lg text-white/90">
                지식정보타운의 새로운 소식
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPosts}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition"
                title="새로고침"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 정보 제출 버튼 */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            사업자 정보 제출
          </button>
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
          <div className="space-y-4">
            {posts.map((post, index) => (
              <article
                key={index}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* 썸네일 */}
                  {getFieldValue(post, '이미지1', 'Image1') && (
                    <div className="md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
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
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
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
                    
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {getFieldValue(post, '제목 ', '제목', 'title', 'Title') || '제목 없음'}
                    </h2>
                    
                    {getFieldValue(post, '컨텐츠 ', '컨텐츠', 'content', 'Content') && (
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {getFieldValue(post, '컨텐츠 ', '컨텐츠', 'content', 'Content')}
                      </p>
                    )}
                    
                    <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                      자세히 보기
                      <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

