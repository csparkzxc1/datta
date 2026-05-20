# Fonts

## 임베드된 폰트 (Google Fonts npm 패키지)

다음 폰트는 `@expo-google-fonts/*` 패키지로 자동 로드됩니다:

- `NotoSerifKR_500Medium` — 헤더·카드 제목 (§6.2)
- `NotoSerifKR_700Bold` — 강조 헤더
- `GowunDodum_400Regular` — 본문
- `CormorantGaramond_400Regular_Italic` — 영문·메타정보·D-day

## ★ 직접 추가 필요: MaruBuri (마루 부리)

CLAUDE.md §6.2 손글씨 액센트 폰트 `MaruBuri-Regular`는 Google Fonts에
없어서 우아한형제들 공식 배포처에서 직접 받아야 합니다.

**다운로드:**
https://www.woowahan.com/fonts (또는 maru-buri 공식 배포 페이지)

**설치 방법:**

1. `MaruBuri-Regular.otf` 파일을 받아 `assets/fonts/`에 넣습니다.
2. `theme/use-fonts.ts`에 추가:
   ```ts
   const MaruBuri_400Regular = require('@/assets/fonts/MaruBuri-Regular.otf');

   export function useDattaFonts() {
     return useFonts({
       // 기존 4종
       NotoSerifKR_500Medium,
       NotoSerifKR_700Bold,
       GowunDodum_400Regular,
       CormorantGaramond_400Regular_Italic,
       // 새로 추가
       MaruBuri_400Regular,
     });
   }
   ```
3. `theme/tokens.ts`의 `fonts.hand` 값(`'MaruBuri_400Regular'`)이 이미
   매핑돼 있어 코드 수정 불필요.

**라이센스:** OFL (오픈폰트 라이센스). 자유 사용·재배포 가능.
