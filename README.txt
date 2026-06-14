CHAN STAGE K-POP v1 사용 방법

파일 구성:
- student.html : 학생 화면
- admin.html : 보호자 화면
- style.css : 디자인
- shared.js : 공통 데이터/비밀번호

실행:
1. 압축을 풉니다.
2. student.html을 열면 학생 화면이 보입니다.
3. admin.html을 열면 보호자 화면이 보입니다.
4. 보호자 비밀번호는 1234입니다.

웹서버 업로드:
- 위 4개 파일을 같은 폴더에 올리세요.
- 예: https://도메인/chan-stage/student.html
- 예: https://도메인/chan-stage/admin.html

중요:
- 현재 버전은 localStorage 저장입니다.
- 같은 기기/같은 브라우저에서는 학생/보호자 화면이 기록을 공유합니다.
- 다른 기기에서 실시간 공유하려면 Firebase 버전으로 바꿔야 합니다.
