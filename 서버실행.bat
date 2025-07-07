@echo off
echo ====================================
echo   청소공작소 로컬 서버 실행
echo ====================================
echo.

cd /d "%~dp0"

echo Python 서버를 시작합니다...
echo.
echo 브라우저에서 http://localhost:8000 을 열어주세요!
echo.
echo 서버를 종료하려면 Ctrl+C를 누르세요
echo ====================================
echo.

python -m http.server 8000

pause