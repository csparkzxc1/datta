# 닿다 (Datta)

> 부모가 자녀에게 미래의 어느 날 닿게 될 편지·사진을 봉인하는 앱.

상세한 제품 비전·브랜드·UX 원칙은 [CLAUDE.md](./CLAUDE.md)를 보세요. **모든 결정의 single source of truth**입니다.

## 기술 스택

- React Native + Expo **SDK 55** (★ 정확히 고정 — §3.1.1)
- TypeScript strict, Zustand, TanStack Query, NativeWind
- Supabase (PostgreSQL + Auth + Edge Functions) + Cloudflare R2
- 토스페이먼츠 + RevenueCat (계획)

## 로컬 셋업

### 1. 의존성

```bash
node >= 20
npm install
```

> `pnpm` 사용 금지. lockfile은 `package-lock.json` 하나만 유지하세요(§3.1, §3.4).

### 2. 환경변수

```bash
cp .env.example .env
# .env에 Supabase URL/ANON_KEY 입력
```

### 3. Supabase

```bash
# Supabase CLI 설치 후
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                       # supabase/migrations/* 적용
supabase functions deploy get-upload-url
supabase functions deploy deliver-capsules
```

R2 시크릿과 cron 등록은 [`supabase/functions/README.md`](./supabase/functions/README.md) 참고.

### 4. iOS 빌드 (Mac)

★ Sprint 1 가이드 §3.1.1의 4단계 의식:

```bash
npx expo prebuild --clean --platform ios
cd ios && pod install --repo-update && cd ..
npx expo run:ios
```

문제 발생 시 Xcode 캐시 의심:

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```

`npx expo-doctor`가 0 fail이어야 합니다(§3.1.1 규칙 3).

## 검증 체크리스트

- [ ] `npx tsc --noEmit` 통과
- [ ] `npx expo lint` 통과
- [ ] `npx expo-doctor` 0 fail
- [ ] iOS 시뮬레이터 빌드 성공
- [ ] 스플래시 → 워드마크 페이드인 → 랜덤 메시지 → 온보딩 진입
- [ ] 이메일 가입 → `(tabs)` 진입
- [ ] 자녀 등록 → 캡슐 작성(4단계 마법사) → 봉인 시그니처 애니메이션

## 디렉토리

```
app/                      expo-router 라우트
  (tabs)/                 캡슐·자녀·나
  onboarding/             환영·약속·로그인
  child/                  자녀 상세·등록
  capsule/new.tsx         캡슐 4단계 마법사
components/
  brand/                  Wordmark, Monogram, DattaSplash, SealAnimation
  ui/                     Button, Card, Input, Choice, ImagePicker, MilestoneCard
  child/, capsule/        도메인 컴포넌트
lib/
  supabase.ts             SecureStore adapter 붙은 client
  auth-store.ts           Zustand
  query-client.ts         TanStack Query
  queries/                children, capsules
  milestones.ts           §5.3 마일스톤 + 나이 계산
  r2-upload.ts            Edge Function 호출 + R2 PUT + capsule_media INSERT
theme/
  tokens.ts               §6.1 디자인 토큰
  use-fonts.ts            Google Fonts 로더
supabase/
  migrations/             RLS 포함 초기 스키마
  functions/
    get-upload-url/       R2 signed PUT URL 발급
    deliver-capsules/     매일 cron 발송 처리
assets/
  brand/                  워드마크·모노그램 SVG 7종 (§2.4)
  fonts/                  MaruBuri 수동 추가 자리 (§6.2)
  images/                 Expo 기본 자산 (PNG 교체 필요)
```

## 작업 원칙 (§0)

- 시니어 풀스택 + PM 가드레일 역할
- §7 Anti-FOMO 절대 — "기록 안 한 날 N일" 같은 부재 강조 카피 금기
- §10 신뢰 시스템 — 영구 백업·자동 발송·상속·transparency
- §3.1.1 패키지 설치는 `npx expo install`만 — SDK 버전 불일치는 4시간 빚
- 자녀 데이터는 신성, 분석/외부 SDK로 절대 전송 금지

## 라이센스

비공개.
