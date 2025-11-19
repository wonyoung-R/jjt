# Google Apps Script 설치 가이드

## 📝 설치 단계

### 1단계: Google Sheets 열기
[Google Sheets 링크](https://docs.google.com/spreadsheets/d/1K8o5dOzYdmYOZEZvKalgQ7ALMweSK9LIirGxpfRtxsA/edit?gid=1956540147)

### 2단계: Apps Script 에디터 열기
1. 상단 메뉴: **확장 프로그램** > **Apps Script**
2. 새 프로젝트가 열립니다

### 3단계: 코드 붙여넣기
1. 기존 코드를 모두 삭제
2. `google-apps-script.gs` 파일의 코드를 복사하여 붙여넣기
3. **저장** 버튼 클릭 (또는 Ctrl+S)

### 4단계: 웹 앱 배포
1. 우측 상단 **배포** 버튼 클릭
2. **새 배포** 선택
3. 설정:
   - **유형 선택**: 웹 앱
   - **설명**: "사업자 정보 제출 API" (선택사항)
   - **다음 계정으로 실행**: 나
   - **액세스 권한**: **모든 사용자** (중요!)
4. **배포** 클릭

### 5단계: 권한 승인
1. 권한 검토 화면이 나타나면 **액세스 권한 부여** 클릭
2. Google 계정 선택
3. "안전하지 않은 앱 차단됨" 경고가 나오면:
   - **고급** 클릭
   - **[프로젝트명]으로 이동(안전하지 않음)** 클릭
   - **허용** 클릭

### 6단계: 웹 앱 URL 복사
1. 배포 완료 화면에서 **웹 앱 URL** 복사
2. URL 형식: `https://script.google.com/macros/s/AKfycby.../exec`

### 7단계: React 앱에 URL 적용
1. `src/components/SubmitInfoModal.jsx` 파일 열기
2. 41번째 줄 찾기:
```javascript
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```
3. 복사한 URL로 교체:
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```
4. 파일 저장

---

## ✅ 테스트 방법

### 브라우저에서 직접 테스트:
복사한 URL을 브라우저 주소창에 붙여넣고 Enter
- 성공 시: `{"status":"ok","message":"Google Apps Script가 정상적으로 작동 중입니다."}`

### 웹사이트에서 테스트:
1. 게시판 페이지 접속
2. "사업자 정보 제출" 버튼 클릭
3. 정보 입력 후 "제출하기" 클릭
4. Google Sheets에서 데이터 확인

---

## 📊 Google Sheets 구조

시트 이름: **requestModal** (또는 gid=1956540147에 해당하는 시트)

| A(순번) | B(날짜) | C(제목) | D(내용) | E(상호명) | F(대표님 성함) | G(연락처) | H(이메일) | I(처리 여부) |
|---------|---------|---------|---------|-----------|---------------|-----------|-----------|--------------|
| 1       | 2025... | 제목    | 내용    | 상호명    | 홍길동        | 010-...   | email@... | 미처리       |

---

## 🔧 문제 해결

### 1. "시트를 찾을 수 없습니다" 에러
- Apps Script 코드에서 `SHEET_NAME` 확인
- Google Sheets에서 실제 시트 이름과 일치하는지 확인

### 2. CORS 에러
- Apps Script 배포 시 "액세스 권한"을 "모든 사용자"로 설정했는지 확인

### 3. 데이터가 추가되지 않음
- 브라우저 콘솔(F12)에서 에러 확인
- Apps Script의 실행 로그 확인 (Apps Script 에디터 > 실행 로그)

### 4. 권한 에러
- Google 계정의 앱 권한 설정 확인
- Apps Script를 다시 배포

---

## 📌 중요 사항

1. **보안**: Apps Script URL은 공개되어도 괜찮지만, 스프레드시트 편집 권한은 제한하세요
2. **백업**: 중요한 데이터는 주기적으로 백업하세요
3. **처리 여부**: 제출된 데이터는 "미처리" 상태로 저장되며, 수동으로 "처리 완료"로 변경하세요

---

## 💡 추가 기능

### 이메일 알림 추가 (선택사항)
Apps Script 코드에 다음 함수 추가:

```javascript
function sendEmailNotification(data) {
  const recipient = 'chrit.dylan.yoo@gmail.com';
  const subject = '[지정타] 새로운 사업자 정보 제출';
  const body = `
새로운 사업자 정보가 제출되었습니다.

제목: ${data.title}
상호명: ${data.businessName}
연락처: ${data.contactPhone}
이메일: ${data.contactEmail}

Google Sheets에서 확인하세요.
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}
```

그리고 `doPost` 함수에서 `sheet.appendRow(newRow);` 다음 줄에 추가:
```javascript
sendEmailNotification(data);
```

