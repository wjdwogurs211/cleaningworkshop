#!/usr/bin/env python3
"""
청연 웹사이트 로컬 서버
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # CORS 헤더 추가
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def do_GET(self):
        # 루트 경로 요청시 index.html로 리다이렉트
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

# 현재 디렉토리로 이동
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"청연 웹사이트 서버 시작중...")
print(f"현재 디렉토리: {os.getcwd()}")
print(f"\n사용 가능한 파일:")
for file in Path('.').glob('*.html'):
    print(f"  - {file}")

# 서버 시작
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"\n✓ 서버가 시작되었습니다!")
    print(f"브라우저에서 다음 주소로 접속하세요:")
    print(f"\n  http://localhost:{PORT}")
    print(f"  http://127.0.0.1:{PORT}")
    
    # Windows에서 실제 IP 주소 표시
    import socket
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"  http://{local_ip}:{PORT}")
    
    print(f"\n종료하려면 Ctrl+C를 누르세요.")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다...")