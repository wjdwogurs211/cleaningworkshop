#!/usr/bin/env python3
import http.server
import socketserver
import os

# 포트 설정
PORT = 8080

# 현재 디렉토리 확인
print(f"서버 시작 디렉토리: {os.getcwd()}")
print(f"파일 목록: {os.listdir('.')}")

# 서버 핸들러
Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n🚀 청소공작소 웹서버가 포트 {PORT}에서 실행 중입니다!")
        print(f"브라우저에서 다음 주소로 접속하세요:")
        print(f"👉 http://localhost:{PORT}")
        print(f"👉 http://127.0.0.1:{PORT}")
        print("\nCtrl+C를 눌러 서버를 중지할 수 있습니다.")
        httpd.serve_forever()
except OSError as e:
    print(f"❌ 에러: {e}")
    print(f"포트 {PORT}가 이미 사용 중일 수 있습니다.")
except KeyboardInterrupt:
    print("\n서버를 중지합니다...")