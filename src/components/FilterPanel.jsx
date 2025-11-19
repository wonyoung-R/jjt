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
  const mainCategories = Array.from(categories.keys());
  
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
      {/* 대분류 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="w-1 h-6 bg-primary-600 mr-3 rounded"></span>
          카테고리
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {mainCategories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 중분류 */}
      {subCategories.length > 0 && (
        <div className="mb-6 animate-slide-down">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-1 h-6 bg-secondary-600 mr-3 rounded"></span>
            세부 카테고리
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSubCategoryChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedSubCategory === 'all'
                  ? 'bg-secondary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {subCategories.map(subCategory => (
              <button
                key={subCategory}
                onClick={() => onSubCategoryChange(subCategory)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedSubCategory === subCategory
                    ? 'bg-secondary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="mb-6 animate-slide-down">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-1 h-6 bg-blue-400 mr-3 rounded"></span>
            상세 분류
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onDetailCategoryChange('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedDetailCategory === 'all'
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {detailCategories.map(detailCategory => (
              <button
                key={detailCategory}
                onClick={() => onDetailCategoryChange(detailCategory)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedDetailCategory === detailCategory
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="flex justify-end animate-fade-in">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;

