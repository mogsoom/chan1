찬 미션판 매일체크 + Firebase 동기화 수정본

교체 파일:
- admin.html
- student.html
- shared.js
- style.css

중요:
- firebase-config.js는 기존에 GitHub에 올린 실제 설정값 파일을 그대로 유지하세요.
- 이 zip 안에는 firebase-config.js를 넣지 않았습니다.
- 위 4개 파일만 /chan1 폴더에 덮어쓰기 업로드하면 됩니다.

수정 내용:
1. 미션 완료 상태를 missions[].done에 저장하지 않음
2. 날짜별 완료 기록 dailyDone[YYYY-MM-DD][missionId]에 저장
3. 날짜가 바뀌면 같은 미션 버튼을 다시 누를 수 있음
4. 찬 화면에서 누른 기록이 Firebase에 저장되어 관리자 화면에서 실시간으로 보임
5. 예전 dailyLights 데이터도 dailyBadges로 읽도록 보정
