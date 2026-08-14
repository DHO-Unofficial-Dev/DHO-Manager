# 완전한 화면 테마 예시

이미지 자산 없이 네비게이터 GUI, 정보 패널, 조향 HUD, 지도 HUD, 항해선과 벡터 마커를 한 번에 바꾸는 규격 1 예시입니다.

```powershell
node tools/validate-pack.mjs examples/dho-pack/visual-theme
node tools/build-dho-pack.mjs examples/dho-pack/visual-theme dist/visual-theme.dho-pack
node tools/verify-archive.mjs dist/visual-theme.dho-pack
```

색상과 모양은 리소스팩의 영역이고, HUD 위치·크기·투명도 같은 개인 배치는 사용자 설정의 영역입니다.
