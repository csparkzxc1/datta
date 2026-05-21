# 브랜드 자산

CLAUDE.md §2.4 워드마크·모노그램 정의대로 작성된 SVG 7종입니다.

## 파일

### 워드마크 4종 (가로 800×300)
| 파일 | 용도 |
|---|---|
| `wordmark-ink-on-paper.svg` | 메인. 모든 밝은 배경 |
| `wordmark-paper-on-ink.svg` | 어두운 배경 위 |
| `wordmark-mono-ink.svg` | 단색 ink-warm (인쇄·도장·flat) |
| `wordmark-mono-paper.svg` | 단색 paper (어두운 단색 표면) |

### 모노그램 3종 (정사각 1024×1024)
| 파일 | 용도 |
|---|---|
| `monogram-square.svg` | 앱 아이콘 정신. 둥근 모서리 사각형 |
| `monogram-circle.svg` | 원형 (소셜 프로필 등) |
| `monogram-bare.svg` | 배경 없음 (다른 배경 위 합성) |

## 폰트 의존성

모든 SVG는 **Noto Serif KR Medium**(`Noto Serif CJK KR`로 fallback)에 의존합니다. 다음 두 가지 방식 중 하나로 사용하세요:

### 1) 시스템에 폰트 설치 + 그대로 사용
대부분의 한국 환경(macOS, Windows)에는 Noto Serif CJK가 시스템에 깔려 있어 그대로 렌더됩니다. 디자인 툴(Figma/Sketch/Illustrator)에서 import 시 폰트가 자동 매칭됩니다.

### 2) Outline 변환 후 사용
배포 자산(앱 스토어, 마케팅, 인쇄)으로 쓸 때는 폰트 의존성을 제거합니다:

- **Illustrator**: Object > Expand 또는 Type > Create Outlines
- **Inkscape**: Path > Object to Path
- **Figma**: 텍스트 선택 > 우클릭 > Flatten

Outline 변환 후 파일명 끝에 `-outlined.svg`를 붙여 별도 보관하길 권장합니다.

## PNG / iOS 앱 아이콘 익스포트

Expo 앱 아이콘은 `assets/images/icon.png` (1024×1024)에서 자동으로 모든 사이즈를 생성합니다.

**현재 상태:** 템플릿이 만든 placeholder PNG가 그대로 있습니다. 디자이너 또는 사용자가 `monogram-square.svg`를 outline 변환 → PNG 1024×1024로 익스포트하여 다음 파일들을 교체해야 합니다:

- `assets/images/icon.png` (1024×1024)
- `assets/images/adaptive-icon.png` (Android)
- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-background.png` (단색 paper #FAF6EE)
- `assets/images/android-icon-monochrome.png`
- `assets/images/favicon.png` (web, 48×48)
- `assets/images/splash-icon.png` (현재 native splash는 200px 너비로 표시 — app.json 참고)

이 cloud 환경에는 SVG→PNG 변환 도구(rsvg-convert, ImageMagick)와 한글 폰트가 없어 자동 변환이 불가능합니다. 디자이너 또는 사용자 로컬 환경에서 진행해주세요.

## 워드마크의 봉인 도트 위치

§2.4 명세는 *두 번째 "ㅏ" 위*의 미세 도트를 언급합니다. 현재 SVG는 한글 글자 분해 없이 *우상단 근처*에 도트를 배치한 근사형입니다. 디자이너가 outline 변환할 때 도트를 두 번째 "ㅏ" 정확한 위치로 미세 조정해주세요.
