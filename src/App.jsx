import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import FacilityCard from './components/FacilityCard';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Board from './components/Board';
import FloatingKakaoButton from './components/FloatingKakaoButton';

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
            setFacilities(results.data);
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
    return facilities.filter(facility => {
      if (selectedCategory !== 'all' && facility['대분류'] !== selectedCategory) {
        return false;
      }
      if (selectedSubCategory !== 'all' && facility['중분류'] !== selectedSubCategory) {
        return false;
      }
      if (selectedDetailCategory !== 'all' && facility['소분류'] !== selectedDetailCategory) {
        return false;
      }
      return true;
    });
  }, [facilities, selectedCategory, selectedSubCategory, selectedDetailCategory]);

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
      <Header onBoardClick={() => setCurrentView('board')} />
      
      {/* 카카오톡 플로팅 버튼 */}
      <FloatingKakaoButton />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
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
        
        <div className="mb-6">
          <p className="text-lg text-gray-700">
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
            {filteredFacilities.map((facility, index) => (
              <FacilityCard key={index} facility={facility} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

