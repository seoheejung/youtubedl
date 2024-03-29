## 📫 node.JS의 youtube-dl-exec와 fluent-ffmpeg 모듈로 유튜브 동영상 다운로드 받기

### ✨ 사이트 주소

### 📌 과정
1. 사용자로부터 유튜브 링크 받기
2. youtubedl로 해당 유튜브의 메타데이터 가져오기
3. youtubedl.exec 함수로 영상 다운로드 받기
4. ffmpeg로 webm을 mp4로 변환하기

#### 💡 필요 패키지
```
npm install path fs youtube-dl-exec os fluent-ffmpeg nodemon moment body-parser unorm ejs forever 
```
#### 💡 프로젝트 구조
```
- controllers
  - youtubedlController.js # youtube video 다운로드 컨트롤러
- public
  - css # css 파일이 있는 폴더
  - JS # js 파일이 있는 폴더
  - image # 이미지 파일이 있는 폴더
- routes # 라우터 관리 폴더
- view # ejs 폴더
- app.js
```

#### 🖥 fluent-ffmpeg를 사용하기 위해 ffmpeg 설치 필요
1. 윈도우 패키지 매니저 Chocolatey 설치 (https://halligalli0.tistory.com/38)
2. choco install ffmpeg

#### 서버 실행
```
# 개발 환경 실행
npm run dev

# forever로 서버 실행
npm run start

# forever 서버 종료
npm run stop

# forever 서버 재시작
npm run restart

```

#### exe 실행파일 (electron)
```
npm install --save-dev electron
npx electron-packager . youtubeDL --platform=win32 --arch=x64
/youtubeDL-win32-x64/youtubeDL.exe 파일 관리자 권한 실행 필요
```

#### 💬 이후 작업
```
CSS 작업 (완료)
exe 실행파일 만들기 (jQuery가 exe파일에서 읽히지 않아 바닐라 스크립트로 변경)
```
