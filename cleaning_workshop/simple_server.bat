@echo off
cd /d "C:\Users\cksgo\OneDrive\바탕 화면\extracted_files\cleaninglab_clone\cleaning_workshop"
echo 청소공작소 웹서버를 시작합니다...
echo.
echo 브라우저에서 http://localhost:8000 으로 접속하세요!
echo.
python -m http.server 8000
pause