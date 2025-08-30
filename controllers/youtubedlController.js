const youtubedl = require('youtube-dl-exec');
const path = require('path');
const os = require('os');
const fs = require('fs');

const downloadVideo = (videoUrl) => {
  return new Promise((resolve, reject) => {
    // Shorts URL → watch URL 변환
    if (videoUrl.includes('youtube.com/shorts/')) {
      const id = videoUrl.split('/shorts/')[1].split('?')[0];
      videoUrl = `https://www.youtube.com/watch?v=${id}`;
    }

    const directoryPath = path.join(os.homedir(), 'Desktop');
    // ⭐ 유튜브 제목 그대로 사용
    const outputTemplate = path.join(directoryPath, '%(title)s.%(ext)s');

    const subprocess = youtubedl.exec(videoUrl, {
      format: 'bestvideo+bestaudio/best',
      mergeOutputFormat: 'mp4',
      output: outputTemplate,
      noPart: true,
      windowsFilenames: true,
      // restrictFilenames: true,  // ← 이걸 켜면 한글/특수문자 다 언더바로 바뀌므로 끄는 게 좋음
      cookies: path.join(__dirname, '../cookies/youtube.txt'),
      referer: 'https://www.youtube.com/',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      geoBypass: true,
      forceIpv4: true,
      quiet: true,
      noWarnings: true,
      noProgress: true,

      ffmpegLocation: 'C:\\ProgramData\\chocolatey\\lib\\ffmpeg\\tools\\ffmpeg\\bin\\ffmpeg.exe'
    });

    console.log(`${subprocess.pid} . 파일 템플릿 : ${outputTemplate}`);

    subprocess.on('exit', (code) => {
      console.log(`${subprocess.pid} . Process exited with code ${code}`);
      if (code !== 0) {
        return reject(new Error(`yt-dlp exited with code ${code}`));
      }

      // 최종 mp4 파일이 존재하는지 확인
      const files = fs.readdirSync(directoryPath);
      const finalFile = files.find(f => f.endsWith('.mp4'));

      if (!finalFile) {
        return reject(new Error('다운로드된 비디오 파일을 찾을 수 없습니다.'));
      }

      const finalPath = path.join(directoryPath, finalFile);
      console.log(`✅ 다운로드 완료 → ${finalPath}`);
      resolve(finalPath);
    });

    subprocess.on('error', (err) => reject(err));
  });
};

module.exports = { downloadVideo };
