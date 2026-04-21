# landing/assets/

`landing/post.html` 및 GitHub Pages 배포 페이지에서 참조하는 이미지 에셋.

## 필요 파일 (Task 8/9 manual 에서 추가)

| 파일 | 용도 | 권장 크기 |
|---|---|---|
| `logo.png` | 히어로 섹션 로고 | 64×64 (실제 출력), 128×128 원본 |
| `screenshot-grid.png` | 메인 그리드 스크린샷 | 가로 1200~1600px |
| `screenshot-edit.png` | 계정 편집 다이얼로그 | 다이얼로그 전체 |
| `screenshot-position.png` | PositionPicker 영역 | 기능 영역만 |
| `screenshot-smartscreen.png` | SmartScreen 우회 가이드 | 2~3 스텝 스크린샷 합본 |
| `icon-feature-multi.png` | 다중 계정 기능 아이콘 | 32×32 |
| `icon-feature-reconnect.png` | 재접속 기능 아이콘 | 32×32 |
| `icon-feature-position.png` | 위치 제어 기능 아이콘 | 32×32 |
| `icon-feature-portable.png` | 포터블 기능 아이콘 | 32×32 |

## 배포 흐름

1. 이 폴더에 PNG 파일 추가 → main push
2. `pages.yml` 이 `release` workflow 성공 직후 또는 `landing/**` 변경 시 자동 실행
3. `DHO-Unofficial-Dev/DHO-Manager` 의 `gh-pages` 브랜치로 배포
4. `https://dho-unofficial-dev.github.io/DHO-Manager/` 에 노출

## 이미지 원본 저장 방침

원본 (PSD/Figma) 은 이 리포에 커밋하지 않음. PNG 만 저장.
