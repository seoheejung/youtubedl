document.addEventListener('DOMContentLoaded', () => {
    // Toast 설정
    const Toast = Swal.mixin({
        toast: true,
        position: 'center-center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    document.querySelector('#downloadButton').addEventListener('click', () => {
        console.log("download response");
        let videoUrl = document.querySelector('#videoUrl').value;
        if (!videoUrl) {
            Swal.fire({
                icon: 'warning',
                text: '유튜브 URL을 입력해주세요.',
            });
        } else if (!/^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/.test(videoUrl)) {
            document.querySelector('#videoUrl').value = ''; // 입력 필드 비우기
            Swal.fire({
                icon: 'warning',
                text: '유효한 유튜브 URL을 입력해주세요.'
            });
        } else {
            // 버튼 비활성화
            document.querySelector('#downloadButton').disabled = true;
            // 로딩 바 표시
            document.querySelector('#progressBar').style.display = 'block';
            
            fetch('/ytdl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "videoUrl": videoUrl
                })
            })
            .then(response => response.json())
            .then(response => {
                // 성공적으로 완료된 경우에 실행할 코드
                document.querySelector('#videoUrl').value = '';
                document.querySelector('#downloadButton').disabled = false; // 버튼 활성화
                document.querySelector('#progressBar').style.display = 'none'; // 로딩 바 숨기기
                Toast.fire({
                    icon: 'success',
                    title: '해당 영상이 바탕화면에 다운로드 되었습니다.'
                });
            })
            .catch(error => {
                // 오류가 발생한 경우에 실행할 코드
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    text: '다운로드 중 오류가 발생했습니다.',
                }).then(() => {
                    document.querySelector('#progressBar').style.display = 'none';
                    window.location.reload();  // 새로고침
                });
            });
        }
    });
});
