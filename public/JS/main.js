$(document).ready(() => {
    // Toast 알림창
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
    })

    $('#downloadButton').click(() => {
        let videoUrl = $('#videoUrl').val();
        if(!videoUrl) {
            Swal.fire({
                icon: 'warning',
                text: '유튜브 URL을 입력해주세요.',
            });
        }
        else if(!/^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/.test(videoUrl)) {
            $('#videoUrl').val(''); // 입력 필드 비우기
            Swal.fire({
                icon: 'warning',
                text: '유효한 유튜브 URL을 입력해주세요.'
            });
        }
        else {
            // 버튼 비활성화
            $('#downloadButton').prop('disabled', true);
            // 로딩 바 표시
            $('#progressBar').show();
            $.ajax({
                url: '/ytdl',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "videoUrl": videoUrl
                }),
                success: (response) => {
                    // 성공적으로 완료된 경우에 실행할 코드
                    $('#videoUrl').val('');
                    $('#downloadButton').prop('disabled', false); // 버튼 활성화
                    $('#progressBar').hide(); // 로딩 바 숨기기
                    Toast.fire({
                        icon: 'success',
                        title: '해당 영상이 바탕화면에 다운로드 되었습니다.'
                    })
                },
                error: (error) => {
                    // 오류가 발생한 경우에 실행할 코드를 여기에 작성하세요.
                    console.error('Error:', error.responseJSON.error);
                    Swal.fire({
                        icon: 'error',
                        text: error.responseJSON.error,
                    }).then(() => {
                        $('#progressBar').hide();
                        location.reload();  // 새로고침
                    });
                }
            });
        }


    });
});
