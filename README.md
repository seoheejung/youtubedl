# 📫 node.JS의 youtube-dl-exec와 fluent-ffmpeg 모듈로 유튜브 동영상 다운로드 받기

## ✨ 주요 기능
- 유튜브 링크 입력 시 자동 다운로드
- youtube-dl-exec를 통한 동영상/오디오 추출
- fluent-ffmpeg로 webm → mp4 변환
- Express 기반 서버 + EJS 뷰 지원
- **로그인 필요 영상도 쿠키 파일(youtube.txt)로 지원**
- Express + EJS 기반 웹 UI
- Electron을 이용한 .exe 실행파일 패키징

## 📌 동작 과정
1. 사용자로부터 유튜브 링크 받기
2. `youtube-dl-exec`으로 영상 메타데이터 가져오기
3. `youtubedl.exec()` 실행 → 영상 다운로드
4. 쿠키(`youtube.txt`)를 이용해 로그인 세션 기반 다운로드 가능
5. 다운로드된 `webm` → `ffmpeg`를 이용해 `mp4`로 변환

## 💡 프로젝트 구조
```
- controllers/
  └─ youtubedlController.js   # 유튜브 다운로드 컨트롤러
- cookies/
  └─ youtube.txt              # Netscape 포맷 유튜브 쿠키
- public/
  ├─ css/                     # CSS 파일
  ├─ js/                      # JavaScript 파일
  └─ image/                   # 이미지 파일
- routes/                     # 라우터 관리
- views/                      # EJS 템플릿
- app.js                      # 서버 엔트리

```

### 💡 필요 패키지
```
npm install youtube-dl-exec fluent-ffmpeg path fs os unorm ejs express body-parser moment nodemon forever
```

### 🔑 쿠키 설정 (youtube.txt)
- 유튜브에 로그인된 상태에서 아래 과정을 통해 실제 로그인 세션 쿠키를 저장해야 합니다.
  1. 크롬/웨일에서 로그인된 상태
  2. 확장 프로그램 “Get cookies.txt LOCALLY” 설치
      https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc
  3. `youtube.com`에서 확장 실행 → `youtube.txt` 저장
  4. 프로젝트 경로에 저장:
      ```
      프로젝트/cookies/youtube.txt
      ```
  5. 코드에서 yt-dlp 실행 시 옵션으로 사용:
      ```
      cookies: path.join(__dirname, '../cookies/youtube.txt')
      ```
- 이 방식은 브라우저가 켜져 있어도 DB 잠금 문제 없이 동작합니다.


### 🖥 fluent-ffmpeg를 사용하기 위해 ffmpeg 설치 필요
1. 윈도우 패키지 매니저 Chocolatey 설치 (https://halligalli0.tistory.com/38)
2. `choco install ffmpeg`
3. 설치 후 ffmpeg 경로
    ```
    C:\ProgramData\chocolatey\lib\ffmpeg\tools\ffmpeg\bin\ffmpeg.exe
    ```
4. Node.js 코드에서 ffmpeg 경로 지정:
    ```
    ffmpegLocation: 'C:\\ProgramData\\chocolatey\\lib\\ffmpeg\\tools\\ffmpeg\\bin\\ffmpeg.exe'
    ```

### 🔧 명령어 직접 실행 (테스트용)
- 코드에서 오류가 발생할 경우, 터미널(PowerShell)에서 직접 yt-dlp 명령어를 실행해 정상 동작 여부를 확인할 수 있습니다:
```
.\node_modules\youtube-dl-exec\bin\yt-dlp.exe "https://www.youtube.com/watch?v={유튜뷰영상코드}" `
  --cookies "cookies\youtube.txt" `
  --format "bestvideo+bestaudio/best" `
  --merge-output-format mp4 `
  -o "$env:USERPROFILE\Desktop\%(title)s.%(ext)s"
```
  - --cookies: 로그인 세션 쿠키(cookies/youtube.txt) 사용
  - --format: 최고 화질 비디오 + 오디오 다운로드
  - --merge-output-format mp4: 다운로드 후 mp4 파일로 병합
  - -o: 출력 경로 및 파일명 지정 (%(title)s는 영상 제목으로 자동 대체됨)

👉 이 명령어로 정상 다운로드가 되면, Node.js 코드에서도 동일하게 동작해야 합니다.  
만약 콘솔에서는 성공하는데 코드에서는 실패한다면 쿠키 경로, ffmpeg 경로, 또는 파일 권한 문제일 가능성이 높습니다.

### 서버 실행
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

### exe 실행파일 (electron)
```
npm install --save-dev electron
npx electron-packager . youtubeDL --platform=win32 --arch=x64
```
- 생성된 실행 파일
```
/youtubeDL-win32-x64/youtubeDL.exe
```
- ⚠️ 반드시 관리자 권한으로 실행 필요