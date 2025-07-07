#!/usr/bin/env python3
"""
이미지 최적화 스크립트
- PNG/JPG를 WebP로 변환
- 이미지 크기 최적화
- 지연 로딩을 위한 HTML 업데이트
"""

import os
from PIL import Image
import glob

def optimize_image(input_path, quality=85):
    """이미지를 최적화하고 WebP로 변환"""
    try:
        img = Image.open(input_path)
        
        # 원본 파일명에서 확장자 제거
        base_name = os.path.splitext(input_path)[0]
        
        # WebP로 저장
        webp_path = f"{base_name}.webp"
        img.save(webp_path, 'WEBP', quality=quality, method=6)
        
        # 원본과 최적화된 파일 크기 비교
        original_size = os.path.getsize(input_path)
        optimized_size = os.path.getsize(webp_path)
        reduction = (1 - optimized_size / original_size) * 100
        
        print(f"✓ {os.path.basename(input_path)} → {os.path.basename(webp_path)}")
        print(f"  크기: {original_size:,} → {optimized_size:,} bytes ({reduction:.1f}% 감소)")
        
        # 썸네일 생성 (지연 로딩용)
        thumbnail_path = f"{base_name}_thumb.webp"
        img.thumbnail((50, 50))
        img.save(thumbnail_path, 'WEBP', quality=20)
        
        return webp_path, thumbnail_path
        
    except Exception as e:
        print(f"✗ 오류 발생: {input_path} - {str(e)}")
        return None, None

def update_html_files():
    """HTML 파일의 이미지 참조를 WebP로 업데이트하고 지연 로딩 추가"""
    html_files = glob.glob('*.html')
    
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 이미지 태그 찾기 및 업데이트
        updated = False
        
        # PNG/JPG를 WebP로 변경
        for ext in ['.png', '.jpg', '.jpeg']:
            if ext in content:
                content = content.replace(f'"{ext}"', f'".webp"')
                content = content.replace(f"'{ext}'", f"'.webp'")
                updated = True
        
        # 지연 로딩 속성 추가
        if '<img' in content and 'loading=' not in content:
            content = content.replace('<img', '<img loading="lazy"')
            updated = True
        
        if updated:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ {html_file} 업데이트 완료")

def main():
    print("=== 이미지 최적화 시작 ===\n")
    
    # images 디렉토리의 모든 이미지 처리
    image_dir = 'images'
    if os.path.exists(image_dir):
        os.chdir(image_dir)
        
        # PNG와 JPG 파일 찾기
        image_files = glob.glob('*.png') + glob.glob('*.jpg') + glob.glob('*.jpeg')
        
        print(f"{len(image_files)}개의 이미지를 찾았습니다.\n")
        
        for img_file in image_files:
            optimize_image(img_file)
        
        os.chdir('..')
    
    print("\n=== HTML 파일 업데이트 ===\n")
    update_html_files()
    
    print("\n=== 최적화 완료 ===")
    print("\n추가 권장사항:")
    print("1. CDN 사용을 고려하세요")
    print("2. 브라우저 캐싱 헤더를 설정하세요")
    print("3. HTTP/2를 활성화하세요")

if __name__ == "__main__":
    main()