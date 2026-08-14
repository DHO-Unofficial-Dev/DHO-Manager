# 거점 데이터 팩 예시

이 폴더는 `formatVersion: 1`의 최소 거점 데이터 팩이다. 실제 팩을
만들 때 `community.example` 배포자 ID와 그 네임스페이스의 팩 ID, 이름, 제작자,
버전과 좌표를 고유한 값으로 바꾼다.

저장소 루트에서 다음 명령으로 `.dho-pack`을 만든다.

```powershell
.\scripts\build-dho-pack.ps1 `
  -SourceDirectory .\examples\dho-pack\poi-data-basic `
  -OutputPath .\tmp\community-example.dho-pack
```

패키징 스크립트는 원본 폴더를 바꾸지 않고 임시 복사본의 `files`에 모든 외부
파일 SHA-256을 채운다. 따라서 v1 팩은 수동 ZIP 대신 이 스크립트로 만드는 것을
권장한다.

생성된 파일은 네비게이터의 리소스팩 메뉴에서 열고 `거점 데이터`를 선택해 적용한다.
배포 전 제작 문서의 규격 1 호환 범위와 라이선스·출처 값을 다시 확인한다.
