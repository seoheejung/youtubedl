const { app, BrowserWindow } = require('electron');
const path = require('path');
const childProcess = require('child_process');

// Node.js 서버 모듈 가져오기
require('./app'); 

// BrowserWindow를 생성하고 설정하는 코드
function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 960,
        webPreferences: {
            nodeIntegration: true, // Node.js 환경을 활성화
            contextIsolation: false, // 컨텍스트 분리를 비활성화
            enableRemoteModule: true, // Electron 10 이후 버전에서 필요할 수 있음
        }
    });

    // Electron BrowserWindow를 통해 Node.js 서버의 URL 로드
    win.loadURL('http://localhost:3000');  // 서버가 실행 중인 URL
    win.webContents.openDevTools()
}

// Electron의 'ready' 이벤트가 발생했을 때 createWindow 함수를 호출
app.on('ready', () => {
    createWindow();

    // Node.js 서버를 별도의 프로세스로 시작
    childProcess.fork(path.join(__dirname, 'app.js'));
});
