import React from 'react';

function FilterPanel({
  categories,
  selectedCategory,
  selectedSubCategory,
  selectedDetailCategory,
  onCategoryChange,
  onSubCategoryChange,
  onDetailCategoryChange,
  onReset
}) {
  // 카테고리 순서 정의
  const categoryOrder = [
    '음식점',
    '의료,건강',
    '문화,예술',
    '사회,공공기관',
    '금융,보험'
  ];
  
  // 데이터에서 카테고리 추출 후 정의된 순서대로 정렬
  const allCategories = Array.from(categories.keys());
  const mainCategories = categoryOrder
    .filter(cat => allCategories.includes(cat))
    .concat(allCategories.filter(cat => !categoryOrder.includes(cat)));
  
  const subCategories = selectedCategory !== 'all' && categories.has(selectedCategory)
    ? Array.from(categories.get(selectedCategory).subCategories.keys())
    : [];

  const detailCategories = selectedSubCategory !== 'all' && 
    selectedCategory !== 'all' && 
    categories.has(selectedCategory) &&
    categories.get(selectedCategory).subCategories.has(selectedSubCategory)
    ? Array.from(categories.get(selectedCategory).subCategories.get(selectedSubCategory).detailCategories)
    : [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 animate-fade-in mx-2 md:mx-0">
      {/* 대분류 */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3 flex items-center">
          <span className="w-1 h-5 md:h-6 bg-primary-600 mr-2 md:mr-3 rounded"></span>
          카테고리
        </h3>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
            }`}
          >
            전체
          </button>
          
          {/* My Picks 버튼 */}
          <button
            onClick={() => onCategoryChange('my-picks')}
            className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 flex items-center gap-1 md:gap-2 ${
              selectedCategory === 'my-picks'
                ? 'bg-red-500 text-white shadow-md scale-105'
                : 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-95'
            }`}
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="hidden sm:inline">My Picks</span>
            <span className="sm:hidden">찜</span>
          </button>

          {mainCategories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 중분류 */}
      {subCategories.length > 0 && (
        <div className="mb-4 md:mb-6 animate-slide-down">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3 flex items-center">
            <span className="w-1 h-5 md:h-6 bg-secondary-600 mr-2 md:mr-3 rounded"></span>
            세부 카테고리
          </h3>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            <button
              onClick={() => onSubCategoryChange('all')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                selectedSubCategory === 'all'
                  ? 'bg-secondary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
              }`}
            >
              전체
            </button>
            {subCategories.map(subCategory => (
              <button
                key={subCategory}
                onClick={() => onSubCategoryChange(subCategory)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                  selectedSubCategory === subCategory
                    ? 'bg-secondary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                }`}
              >
                {subCategory}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 소분류 */}
      {detailCategories.length > 0 && (
        <div className="mb-4 md:mb-6 animate-slide-down">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3 flex items-center">
            <span className="w-1 h-5 md:h-6 bg-blue-400 mr-2 md:mr-3 rounded"></span>
            상세 분류
          </h3>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            <button
              onClick={() => onDetailCategoryChange('all')}
              className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                selectedDetailCategory === 'all'
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
              }`}
            >
              전체
            </button>
            {detailCategories.map(detailCategory => (
              <button
                key={detailCategory}
                onClick={() => onDetailCategoryChange(detailCategory)}
                className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                  selectedDetailCategory === detailCategory
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                }`}
              >
                {detailCategory}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 초기화 버튼 */}
      {(selectedCategory !== 'all' || selectedSubCategory !== 'all' || selectedDetailCategory !== 'all') && (
        <div className="flex justify-end animate-fade-in pt-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:scale-95 transition-all font-medium text-sm md:text-base"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">필터 초기화</span>
            <span className="sm:hidden">초기화</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;

