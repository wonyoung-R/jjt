import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import FacilityCard from './components/FacilityCard';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Board from './components/Board';
import FloatingKakaoButton from './components/FloatingKakaoButton';
import SubmitInfoModal from './components/SubmitInfoModal';

const GOOGLE_SHEET_CSV_URL = 
  'https://docs.google.com/spreadsheets/d/1K8o5dOzYdmYOZEZvKalgQ7ALMweSK9LIirGxpfRtxsA/export?format=csv&gid=0';

function App() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedDetailCategory, setSelectedDetailCategory] = useState('all');
  const [currentView, setCurrentView] = useState('facilities'); // 'facilities' or 'board'
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  
  // 즐겨찾기 상태 관리 (localStorage 연동)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (facilityId) => {
    setFavorites(prev => {
      if (prev.includes(facilityId)) {
        return prev.filter(id => id !== facilityId);
      }
      return [...prev, facilityId];
    });
  };


  // Google Sheets 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // 데이터에 고유 ID 부여
            const dataWithIds = results.data.map((item, index) => ({
              ...item,
              _id: `${index}_${item['장소명']}` // 고유 ID 생성
            }));
            setFacilities(dataWithIds);
            setLoading(false);
          },
          error: (error) => {
            setError('데이터를 불러오는데 실패했습니다.');
            setLoading(false);
            console.error('CSV parsing error:', error);
          }
        });
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  // 카테고리 추출
  const categories = useMemo(() => {
    const categoryMap = new Map();
    
    facilities.forEach(facility => {
      const mainCat = facility['대분류'] || '';
      const subCat = facility['중분류'] || '';
      const detailCat = facility['소분류'] || '';
      
      if (!mainCat) return;
      
      if (!categoryMap.has(mainCat)) {
        categoryMap.set(mainCat, { subCategories: new Map() });
      }
      
      if (subCat) {
        const mainCategory = categoryMap.get(mainCat);
        if (!mainCategory.subCategories.has(subCat)) {
          mainCategory.subCategories.set(subCat, { detailCategories: new Set() });
        }
        
        if (detailCat) {
          mainCategory.subCategories.get(subCat).detailCategories.add(detailCat);
        }
      }
    });
    
    return categoryMap;
  }, [facilities]);

  // 필터링된 시설
  const filteredFacilities = useMemo(() => {
    // 카테고리 순서 정의 (FilterPanel과 동일)
    const categoryOrder = [
      '음식점',
      '의료,건강',
      '문화,예술',
      '사회,공공기관',
      '금융,보험'
    ];
    
    // 필터링
    const filtered = facilities.filter(facility => {
      // My Picks 필터링
      if (selectedCategory === 'my-picks') {
        return favorites.includes(facility._id);
      }

      // 카테고리 필터링
      if (selectedCategory !== 'all' && facility['대분류'] !== selectedCategory) {
        return false;
      }
      if (selectedSubCategory !== 'all' && facility['중분류'] !== selectedSubCategory) {
        return false;
      }
      if (selectedDetailCategory !== 'all' && facility['소분류'] !== selectedDetailCategory) {
        return false;
      }
      
      // 검색어 필터링
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = (facility['장소명'] || '').toLowerCase();
        const address = (facility['주소'] || '').toLowerCase();
        const mainCat = (facility['대분류'] || '').toLowerCase();
        const subCat = (facility['중분류'] || '').toLowerCase();
        const detailCat = (facility['소분류'] || '').toLowerCase();
        const phone = (facility['전화번호'] || '').toLowerCase();
        
        return name.includes(query) || 
               address.includes(query) || 
               mainCat.includes(query) || 
               subCat.includes(query) || 
               detailCat.includes(query) ||
               phone.includes(query);
      }
      
      return true;
    });
    
    // 카테고리 순서대로 정렬
    return filtered.sort((a, b) => {
      const catA = a['대분류'] || '';
      const catB = b['대분류'] || '';
      
      const indexA = categoryOrder.indexOf(catA);
      const indexB = categoryOrder.indexOf(catB);
      
      // 정의된 순서에 있는 카테고리
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // A만 정의된 순서에 있음
      if (indexA !== -1) return -1;
      // B만 정의된 순서에 있음
      if (indexB !== -1) return 1;
      // 둘 다 정의된 순서에 없으면 알파벳 순
      return catA.localeCompare(catB, 'ko');
    });
  }, [facilities, selectedCategory, selectedSubCategory, selectedDetailCategory, searchQuery, favorites]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory('all');
    setSelectedDetailCategory('all');
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedDetailCategory('all');
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSelectedDetailCategory('all');
    setSearchQuery('');
  };

  const handleShareMyPicks = async () => {
    if (filteredFacilities.length === 0) {
      alert('공유할 목록이 없습니다.');
      return;
    }

    const text = `[오늘 점심 이거 어때? - The Lunch Captain]\n\n${filteredFacilities.map((f, i) => {
      // URL 정보 가져오기 (우선순위: 카카오맵 > 네이버 > 없음)
      const mapUrl = f['카카오맵URL'] || f['네이버URL'] || f['URL'] || '';
      
      return `${i + 1}. ${f['장소명']} (${f['중분류'] || f['대분류']})\n` +
      (f['대표메뉴1'] ? `- 대표메뉴: ${[f['대표메뉴1'], f['대표메뉴2']].filter(Boolean).join(', ')}\n` : '') +
      (mapUrl ? `- 지도: ${mapUrl}\n` : '');
    }).join('\n')}
더 자세한 정보 보기: ${window.location.origin}`;

    try {
      await navigator.clipboard.writeText(text);
      alert('리스트가 복사되었습니다! 카카오톡 등에 붙여넣기 하세요.');
    } catch (err) {
      console.error('복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  // 게시판 보기
  if (currentView === 'board') {
    return <Board onClose={() => setCurrentView('facilities')} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* 카카오톡 플로팅 버튼 */}
      <FloatingKakaoButton />
      
      <main className="flex-grow container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl">
        {/* 검색창 */}
            <div className="mb-4 md:mb-6">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="장소명, 주소, 카테고리 검색..."
                  className="w-full px-4 md:px-5 py-3 md:py-4 pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm"
                />
                <svg 
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 active:scale-90 transition"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <FilterPanel
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              selectedDetailCategory={selectedDetailCategory}
              onCategoryChange={handleCategoryChange}
              onSubCategoryChange={handleSubCategoryChange}
              onDetailCategoryChange={setSelectedDetailCategory}
              onReset={handleReset}
            />
            
            {/* My Picks 공유 버튼 */}
            {selectedCategory === 'my-picks' && filteredFacilities.length > 0 && (
              <div className="mb-6 md:mb-8 flex justify-center animate-fade-in px-2 md:px-0">
                <button
                  onClick={handleShareMyPicks}
                  className="flex items-center gap-2 px-5 md:px-8 py-3 md:py-4 bg-[#FEE500] text-[#191919] rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 md:hover:-translate-y-1 transition-all duration-200 text-sm md:text-base w-full md:w-auto justify-center"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 5.58 2 10c0 2.5 1.43 4.74 3.67 6.25-.16.6-.59 2.19-.62 2.32-.06.26.1.49.35.35l3.76-2.5c.81.12 1.65.18 2.52.18 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                  </svg>
                  <span className="hidden sm:inline">리스트 텍스트로 복사하기 (팀 공유용)</span>
                  <span className="sm:hidden">팀에 공유하기</span>
                </button>
              </div>
            )}

            {/* 상단 배너 영역 (꿀소식 & 사장님 등록) - My Picks 탭이 아닐 때만 노출 */}
            {selectedCategory !== 'my-picks' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 animate-fade-in px-2 md:px-0">
                {/* 1. 지정타 꿀소식 배너 (왼쪽) */}
                <div 
                  onClick={() => setCurrentView('board')}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-5 md:p-6 text-white shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform relative overflow-hidden group h-full flex items-center"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10 flex items-center justify-between w-full gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold mb-1">지정타 꿀소식 🍯</h3>
                      <p className="text-white/90 text-xs md:text-base leading-relaxed">
                        우리 동네 <span className="font-bold text-yellow-200">핫한 이벤트</span>를<br className="hidden md:inline"/>놓치지 마세요!
                      </p>
                    </div>
                    <div className="bg-white/20 p-2 md:p-3 rounded-full flex-shrink-0">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2. 사장님 등록 배너 (오른쪽) */}
                <div 
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 md:p-6 text-white shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform relative overflow-hidden group h-full flex items-center"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10 flex items-center justify-between w-full gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold mb-1">사장님이신가요? 🏪</h3>
                      <p className="text-indigo-100 text-xs md:text-base leading-relaxed">
                        우리 가게를 <span className="font-bold text-yellow-300">무료 등록</span>하고<br className="hidden md:inline"/>홍보하세요!
                      </p>
                    </div>
                    <div className="bg-white/20 p-2 md:p-3 rounded-full flex-shrink-0">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4 md:mb-6 px-2 md:px-0">
              <p className="text-sm md:text-lg text-gray-700">
                {searchQuery && (
                  <span className="text-gray-500">"{searchQuery}" 검색 결과: </span>
                )}
                총 <span className="font-bold text-primary-600">{filteredFacilities.length}</span>개의 시설
              </p>
            </div>

        {filteredFacilities.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500 mb-6">다른 카테고리를 선택해보세요</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => (
              <FacilityCard 
                key={facility._id} 
                facility={facility} 
                isFavorite={favorites.includes(facility._id)}
                onToggleFavorite={() => toggleFavorite(facility._id)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      
      {/* 정보 제출 모달 */}
      <SubmitInfoModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
      />
    </div>
  );
}

export default App;

