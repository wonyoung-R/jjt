/**
 * Google Apps Script - 사업자 정보 제출 처리
 * 
 * 설치 방법:
 * 1. Google Sheets 열기: https://docs.google.com/spreadsheets/d/1K8o5dOzYdmYOZEZvKalgQ7ALMweSK9LIirGxpfRtxsA/edit?gid=1956540147
 * 2. 상단 메뉴: 확장 프로그램 > Apps Script
 * 3. 아래 코드를 복사하여 붙여넣기
 * 4. 저장 후 배포: 배포 > 새 배포
 * 5. 유형: 웹 앱
 * 6. 액세스 권한: "모든 사용자"
 * 7. 배포 후 URL 복사
 * 8. 복사한 URL을 SubmitInfoModal.jsx의 SCRIPT_URL에 붙여넣기
 */

function doPost(e) {
  try {
    // 스프레드시트 ID와 시트 이름
    const SHEET_ID = '1K8o5dOzYdmYOZEZvKalgQ7ALMweSK9LIirGxpfRtxsA';
    const SHEET_NAME = 'requestModal'; // gid=1956540147에 해당하는 시트 이름
    
    // 스프레드시트 및 시트 가져오기
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          'status': 'error',
          'message': '시트를 찾을 수 없습니다.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 마지막 행 번호 가져오기
    const lastRow = sheet.getLastRow();
    
    // 순번 계산 (마지막 행의 순번 + 1)
    let newSequence = 1;
    if (lastRow > 1) {
      const lastSequence = sheet.getRange(lastRow, 1).getValue();
      newSequence = (lastSequence && !isNaN(lastSequence)) ? Number(lastSequence) + 1 : lastRow;
    }
    
    // 새 행 데이터 구성
    // 컬럼: 순번, 날짜, 제목, 내용, 상호명, 대표님 성함, 연락처, 이메일, 처리 여부
    const newRow = [
      newSequence,                    // 순번
      data.date || new Date().toLocaleDateString('ko-KR'),  // 날짜
      data.title || '',               // 제목
      data.content || '',             // 내용
      data.businessName || '',        // 상호명
      data.contactName || '',         // 대표님 성함
      data.contactPhone || '',        // 연락처
      data.contactEmail || '',        // 이메일
      '미처리'                         // 처리 여부
    ];
    
    // 데이터 추가
    sheet.appendRow(newRow);
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': '데이터가 성공적으로 추가되었습니다.',
        'sequence': newSequence
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청 처리 (테스트용)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'ok',
      'message': 'Google Apps Script가 정상적으로 작동 중입니다.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 카테고리 컬럼을 대분류, 중분류, 소분류로 분리하는 함수
 * 
 * 사용 방법:
 * 1. Apps Script 에디터에서 이 함수 선택
 * 2. 실행 버튼 클릭
 * 3. 시트 이름과 카테고리 컬럼을 확인하고 실행
 * 
 * 예: "음식점 > 카페 > 커피전문점" → 대분류: "음식점", 중분류: "카페", 소분류: "커피전문점"
 */
function splitCategoryColumns() {
  const SHEET_ID = '1K8o5dOzYdmYOZEZvKalgQ7ALMweSK9LIirGxpfRtxsA';
  const SHEET_NAME = '시트1'; // 편의시설 데이터가 있는 시트 이름 (gid=0)
  
  // 스프레드시트 및 시트 가져오기
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    Logger.log('시트를 찾을 수 없습니다: ' + SHEET_NAME);
    Browser.msgBox('오류', '시트를 찾을 수 없습니다: ' + SHEET_NAME, Browser.Buttons.OK);
    return;
  }
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  if (lastRow < 2) {
    Browser.msgBox('오류', '데이터가 없습니다.', Browser.Buttons.OK);
    return;
  }
  
  // 헤더 가져오기
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  
  // 카테고리 컬럼 찾기 (예: "카테고리", "분류" 등)
  let categoryColIndex = -1;
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] === '카테고리' || headers[i] === '분류') {
      categoryColIndex = i;
      break;
    }
  }
  
  if (categoryColIndex === -1) {
    Browser.msgBox('오류', '카테고리 컬럼을 찾을 수 없습니다.', Browser.Buttons.OK);
    return;
  }
  
  // 대분류, 중분류, 소분류 컬럼이 이미 있는지 확인
  let mainCatCol = headers.indexOf('대분류') + 1;
  let subCatCol = headers.indexOf('중분류') + 1;
  let detailCatCol = headers.indexOf('소분류') + 1;
  
  // 없으면 새로 추가
  if (mainCatCol === 0) {
    sheet.insertColumnAfter(categoryColIndex + 1);
    sheet.getRange(1, categoryColIndex + 2).setValue('대분류');
    mainCatCol = categoryColIndex + 2;
    lastCol++;
  }
  
  if (subCatCol === 0) {
    sheet.insertColumnAfter(mainCatCol);
    sheet.getRange(1, mainCatCol + 1).setValue('중분류');
    subCatCol = mainCatCol + 1;
    lastCol++;
  }
  
  if (detailCatCol === 0) {
    sheet.insertColumnAfter(subCatCol);
    sheet.getRange(1, subCatCol + 1).setValue('소분류');
    detailCatCol = subCatCol + 1;
    lastCol++;
  }
  
  // 데이터 처리
  const data = sheet.getRange(2, categoryColIndex + 1, lastRow - 1, 1).getValues();
  const results = [];
  
  for (let i = 0; i < data.length; i++) {
    const category = data[i][0];
    let mainCat = '';
    let subCat = '';
    let detailCat = '';
    
    if (category && typeof category === 'string') {
      const parts = category.split('>').map(part => part.trim());
      mainCat = parts[0] || '';
      subCat = parts[1] || '';
      detailCat = parts[2] || '';
    }
    
    results.push([mainCat, subCat, detailCat]);
  }
  
  // 결과 쓰기
  if (results.length > 0) {
    sheet.getRange(2, mainCatCol, results.length, 1).setValues(results.map(r => [r[0]]));
    sheet.getRange(2, subCatCol, results.length, 1).setValues(results.map(r => [r[1]]));
    sheet.getRange(2, detailCatCol, results.length, 1).setValues(results.map(r => [r[2]]));
  }
  
  Browser.msgBox('완료', `${results.length}개의 행을 처리했습니다.`, Browser.Buttons.OK);
}

/**
 * 시트 이름 목록을 보여주는 헬퍼 함수
 */
function showSheetNames() {
  const SHEET_ID = '1K8o5dOzYdmYOZEZvKalgQ7ALMweSK9LIirGxpfRtxsA';
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheets = ss.getSheets();
  const names = sheets.map(s => s.getName()).join('\n');
  Browser.msgBox('시트 목록', names, Browser.Buttons.OK);
}

