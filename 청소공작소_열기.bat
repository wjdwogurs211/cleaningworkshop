@echo off
echo ====================================
echo   청소공작소 웹사이트 열기
echo ====================================
echo.

cd /d "%~dp0"

echo 웹브라우저에서 청소공작소를 엽니다...
start "" "index.html"

echo.
echo 관리자 페이지를 열려면 아무 키나 누르세요...
pause > nul

start "" "cleaning_workshop\admin\login.html"

echo.
echo ====================================
echo   관리자 로그인 정보
echo   ID: admin
echo   PW: 1234
echo ====================================
echo.

pause