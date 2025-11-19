import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-4 text-lg text-gray-600 font-medium">데이터를 불러오는 중...</p>
    </div>
  );
}

export default LoadingSpinner;

