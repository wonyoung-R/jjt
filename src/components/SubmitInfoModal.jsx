import React, { useState } from 'react';

function SubmitInfoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    category: '맛집 홍보', // 기본값
    title: '',
    content: '',
    businessName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.content || !formData.businessName || !formData.contactEmail) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 현재 날짜 생성
      const currentDate = new Date().toLocaleDateString('ko-KR');
      
      // Google Apps Script Web App URL
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJL45os0J0wRhAaUt3BGS8180YQGO4ovpxTX31ecKMCG25DA33orruy1OSNPx9RUKtSw/exec';
      
      // URL이 설정되지 않은 경우 경고
      if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        alert('⚠️ Google Apps Script URL이 설정되지 않았습니다.\n\n설정 방법:\n1. Google Sheets에서 Apps Script 배포\n2. 배포된 URL을 SubmitInfoModal.jsx 파일의 SCRIPT_URL에 입력\n\n자세한 내용은 GOOGLE_APPS_SCRIPT_설치_가이드.md 파일을 참조하세요.');
        setIsSubmitting(false);
        return;
      }
      
      // 전송할 데이터
      const submitData = {
        date: currentDate,
        category: formData.category, // 분류 추가
        title: formData.title,
        content: formData.content,
        businessName: formData.businessName,
        contactName: formData.contactName || '',
        contactPhone: formData.contactPhone || '',
        contactEmail: formData.contactEmail
      };

      console.log('📤 제출 데이터:', submitData);
      console.log('📡 전송 URL:', SCRIPT_URL);

      // Google Apps Script로 데이터 전송
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      console.log('✅ 전송 완료');
      
      // no-cors 모드에서는 응답을 확인할 수 없으므로 성공으로 간주
      setSubmitStatus('success');
      
      // 2초 후 폼 초기화 및 모달 닫기
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);

    } catch (error) {
      console.error('제출 오류:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '맛집 홍보',
      title: '',
      content: '',
      businessName: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    });
    setSubmitStatus(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                📢 소식/이벤트/모임 알리기
              </h2>
              <p className="text-white/90 text-sm">
                신메뉴 출시, 할인 이벤트, 점심 특선 등 지정타 직장인들에게 알리고 싶은 소식을 보내주세요!
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 분류 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              분류 <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition appearance-none bg-white"
            >
              <option value="맛집 홍보">맛집 홍보</option>
              <option value="메뉴 홍보">메뉴 홍보</option>
              <option value="이벤트/할인">이벤트/할인</option>
              <option value="모임/액티비티">모임/액티비티</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="예: 신규 카페 오픈 안내"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows="6"
              placeholder="이벤트 내용, 매장 정보, 메뉴 등을 자세히 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* 안내 문구 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              제출해주신 정보를 확인 후, <strong>남겨주신 연락처로 회신</strong>드리겠습니다.
            </p>
          </div>

          {/* 사업자 정보 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">사업자 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  상호명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  placeholder="예: 스타벅스 과천점"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  담당자명
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* 상태 메시지 */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800">정보가 성공적으로 제출되었습니다!</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">제출 중 오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  제출 중...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  제출하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitInfoModal;

