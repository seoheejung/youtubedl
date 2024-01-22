const youtubedl = require('youtube-dl-exec')
const fs = require('fs')
const path = require('path')
const os = require('os')
const ffmpeg = require('fluent-ffmpeg')
const unorm = require('unorm');

// youtube video 다운로드
const downloadVideo = (videoUrl) => {
    return new Promise((resolve, reject) => {
        // 1. 비디오 정보 가져오기
        youtubedl(videoUrl, {
            dumpSingleJson: true,
        }).then(info => {
            const directoryPath = path.join(os.homedir(), 'Desktop');
            let title = info.title.replace(/[<>:"/\\|?*]/g, '_');
            title = unorm.nfc(title); // 자소분리된 파일이름을 NFC 형태로 정규화
            let outputPath = path.join(directoryPath, `${title}.webm`)
            console.log(outputPath)
            
            // 2. 비디오 다운로드
            const subprocess = youtubedl.exec(videoUrl, {
                format: 'bestvideo+bestaudio/best',
                output: outputPath
            });

            console.log(`Running subprocess as ${subprocess.pid}`);
            // 추가 확장자가 있는 경우
            fs.readdir(directoryPath, function(err, files) {
                if (err) throw err;

                files.forEach(function(file) {
                    if (file.includes(`${title}.webm`)) {
                        const oldPath = path.join(directoryPath, file);
                        const newPath = path.join(directoryPath, `${file.split('.webm')[0]}.webm`);

                        fs.rename(oldPath, newPath, function(err) {
                            if (err) throw err;
                            console.log('File Renamed:', newPath);
                        });
                    }
                });
            });

            // 3. 비디오 변환 
            subprocess.on('exit', code => {
                console.log(`Process exited with code ${code}`);
                if(code === 0){
                    console.log(`Download completed. File saved at ${outputPath}`);
                    ffmpeg(outputPath)
                        .output(path.join(directoryPath, `${title}.mp4`))
                        .on('end', () => {
                            console.log('변환 완료.');
                            fs.unlink(outputPath, err => {
                                if(err) console.error(`파일 삭제 중 오류 발생: ${err.message}`);
                                else console.log(`파일 ${outputPath}가 성공적으로 삭제되었습니다.`);
                            });
                            resolve();  // 변환이 완료되면 Promise를 이행(resolve)합니다.
                        })
                        .on('error', err => {
                            console.error(`변환 중 오류 발생: ${err.message}`);
                            reject(err);  // 변환 중 오류가 발생하면 Promise를 거부(reject)합니다.
                        })
                        .run();
                }
            });

            subprocess.on('error', err => {
                console.error(`An error occurred while downloading the video: ${err.message}`);
                reject(err);  // 다운로드 중 오류가 발생하면 Promise를 거부(reject)합니다.
            });
        });
    });
};


// 선택한 동영상의 사용 가능한 형식 목록이 출력
const listFormats = (videoUrl) => {
    return new Promise((resolve, reject) => {
        youtubedl(videoUrl, {
            listFormats: true,
        }).then(info => {
            console.log(info);
            resolve(info);  // 성공시 resolve 호출
        }).catch(error => {
            reject(error);  // 에러 발생시 reject 호출
        })
    });
}

module.exports = {
    downloadVideo, listFormats
};
