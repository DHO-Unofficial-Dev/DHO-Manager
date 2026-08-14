# 공개 Pages 이미지 자산

`landing/post.html`과 리소스팩 공개 페이지에서 참조하는 배포용 이미지다. 비공개
애플리케이션 소스나 테스트 캡처는 이 폴더에 넣지 않는다.

## 현재 자산

| 파일 | 용도 | 출처 |
| --- | --- | --- |
| `screenshot-grid.png` | 제품 홈의 Manager 계정 카드 화면 | 프로젝트 실앱 캡처 |
| `navigation-hero.png` | 제품 홈 히어로와 Open Graph 미리보기 | OpenAI 이미지 생성 도구로 제작한 프로젝트 전용 삽화 |
| `site.css` | 제품 홈·제작기·문서 공통 디자인 토큰 | 프로젝트 코드 |

`navigation-hero.png`는 글자·로고·인물을 넣지 않고 짙은 네이비 항해 지도, 황동
항해 도구와 청록색 항로만 표현했다. 실제 게임 지도나 제3자 커뮤니티 지도를
복제한 자산이 아니다.

## 배포 흐름

1. 비공개 `DHO-Manager-v2`의 `landing/` 변경을 검증한다.
2. `.github/workflows/pages.yml`이 허용된 정적 파일만 임시 Pages 산출물로 복사한다.
3. 공개 `DHO-Manager` 저장소의 `gh-pages` 고아 브랜치로 결과만 배포한다.
4. `https://manager.dhoport.app/`에서 사용자 페이지를 제공한다.

편집 가능한 원본이나 비공개 저장소 이력은 공개 저장소로 복제하지 않는다.
