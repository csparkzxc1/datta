# CLAUDE.md — 닿다 (Datta)

> **이 문서는 Claude Code가 이 프로젝트에서 작업할 때의 단일 진실(single source of truth)이다.**  
> 코드를 작성하기 전, 결정을 내리기 전, *항상* 이 문서를 먼저 본다.  
> 이 문서와 어긋나는 사용자 요청이 있다면 사용자에게 먼저 알리고, 그래도 진행하라면 진행한다.

-----

## 0. 너에게 (Claude Code에게)

너는 이 프로젝트의 *시니어 풀스택 개발자*다. 동시에 *PM의 의도를 지키는 가드레일* 역할도 한다.

**해야 할 것:**

- 사용자의 요청이 §7 (Anti-FOMO 원칙), §10 (신뢰 시스템), §2 (브랜드)에 위배되면 *반드시 먼저 지적*하고 동의를 구한다
- 패키지 설치는 *반드시* §3.1.1 규칙을 따른다 (위반 시 빌드가 무너진다 — 실제 사례 있음)
- 모든 카피는 §13 톤 가이드를 따른다. "기록을 놓치셨네요" 같은 죄책감 유발 표현 금기
- 의심스러우면 추측하지 말고 질문한다
- 한국어로 작업 보고하고, 한국어 커밋 메시지 작성한다

**금지 사항:**

- 사용자가 요청하지 않은 기능을 추가로 만들지 마라
- "기록 안 한 날 N일째" 같은 *부재 강조* 메시지 절대 금지 (§7)
- 게이미피케이션(연속 일수, 뱃지, 레벨) 절대 금지 — 이 앱은 점수가 아니라 *의례*다
- 푸시 알림으로 *부모를 압박*하지 마라 — 알림은 마일스톤·자녀 생일에만, 그것도 부드럽게
- `npm install expo-xxx` 절대 금지 — Expo 패키지는 반드시 `npx expo install` 사용 (§3.1.1)
- deprecated 패키지 추가 금지 — `expo-av` 등 unmaintained 패키지 (§3.1.2)
- 자녀의 데이터를 *어떤 형태로든* 분석·학습·외부 공유에 사용 금지 (§10)

-----

## 1. 제품 비전

### 1.1 한 줄 정의

**"부모가 자녀에게 미래의 어느 날 닿게 될 편지·사진을 봉인하는 앱"**

### 1.2 약속

- **닿는다** — 봉인한 캡슐은 지정한 그날 자녀에게 *반드시* 닿는다
- **고요하다** — 매일 쓰라고 압박하지 않는다. 1년에 한 번도 괜찮다
- **안전하다** — 가족 외 누구도 보지 못한다. 우리도 못 본다 (E2E 암호화 V2)
- **영원하다** — 회사가 사라져도 캡슐은 사라지지 않는다 (§10 자동 발송 약정)

### 1.3 누구를 위한 앱인가

**1차 타겟:** 0~10세 자녀를 둔 한국 부모. 특히 *첫째*인 경우 최우선.  
**2차 타겟:** 손주가 어린 조부모, 곧 태어날 아이의 부모 (임신 중)

**제외:**

- 자녀가 이미 성인인 부모 (낮은 적합도)
- "자녀 발달 기록"이 목적인 사용자 (베베엔·아띠가 더 잘함)
- 가족 사진 공유가 목적인 사용자 (TinyBeans가 더 잘함)

### 1.4 우리가 *되지 않을* 것

- 일기 앱 (베베엔의 영역)
- 사진 공유 앱 (인스타·구글포토의 영역)
- SNS (의도적으로 비공개·1:1)
- "발달 트래커" (의료적 데이터 X, 마일스톤은 *문화적 의례*만)

-----

## 2. 브랜드 아이덴티티

### 2.1 이름과 의미

- **국문 정식 명칭:** 닿다
- **영문/글로벌:** Datta (음역)
- **태그라인 (한):** "당신의 마음이 자녀에게 닿습니다."
- **태그라인 (영):** "Reach them, one day."
- **의미:** 동사 "닿다"가 곧 제품의 기능이자 약속. 시간을 넘어 마음이 *도착하는* 행위

### 2.2 톤 — Trace와 다르다

Trace는 *고요·진중·편집세리프*. 닿다는 *따뜻·정서적·손편지의 정서*.

같은 PM(cs)이 만들지만 사용자 경험은 *완전히 다른 정서*여야 한다.

|차원    |Trace  |닿다          |
|------|-------|------------|
|정서    |묵상·절제  |정성·따뜻함      |
|메타포   |한지에 먹글씨|정성스럽게 봉인된 편지|
|사용 빈도 |매일     |가끔, 의례적으로   |
|사용자 감정|자기 점검  |자녀를 향한 사랑   |

### 2.3 시각 언어

**컬러 팔레트:**

```
paper        #FAF6EE   /* 종이결 베이지 (배경) */
ink-warm     #2B1F19   /* 따뜻한 잉크 (본문 텍스트) */
peach        #E8927C   /* 메인 액센트 (CTA, 봉인 인장) */
sage         #8FA68E   /* 보조 액센트 (성공·완료 상태) */
gold-warm    #C9A876   /* 마일스톤·강조 (Trace의 gold보다 따뜻) */
ink-soft     #5C4F45   /* 보조 텍스트 (가이드, 메타정보) */
peach-soft   #F4D5C9   /* 배경 강조 (선택된 카드, 호버) */
```

**그라데이션 금지.** 솔리드 컬러만 사용. 손편지의 정서는 *깔끔한 면*에서 나온다.

**타이포그래피:**

- **제목:** Noto Serif KR — Trace와 같음. *우리는 책의 정서를 공유한다*
- **본문:** Gowun Dodum (현재 한글 손글씨 톤 시스템폰트). Trace보다 *부드럽게*
- **손글씨 액센트:** "마루 부리" 또는 "함초롬바탕" — 캡슐 내용 미리보기, 자녀 이름 같은 *감성 지점*에만 사용
- **영문:** Cormorant Garamond — Trace와 같음 (의도적: 같은 PM의 시그니처)
- **숫자/날짜:** Cormorant Garamond italic — D-day, 봉인 날짜

★ **금지:** Sans-serif만으로 본문 구성. Pretendard는 *시스템 UI에서만* (탭바, 알림 등). 정서 영역은 무조건 세리프.

### 2.4 로고 / 워드마크

**워드마크:**

- "닿다" — Noto Serif KR Medium, 검은 ink-warm
- 글자 사이에 *작은 봉인 점* (peach) 하나. "ㄷㅏㅎㄷㅏ" 중 두 번째 "ㅏ" 위에 미세한 도트로 *우표 같은 인상*

**모노그램:**

- "닿" 한 글자 단독 사용 가능
- 앱 아이콘은 둥근 모서리 사각형 + cream 배경 + 가운데 "닿" 한 글자 (ink-warm)
- 보조: peach 색 봉인 도트 우상단 (마치 우표가 붙어있는 듯)

### 2.5 스플래시 화면

- 베이지 paper 배경
- 중앙 워드마크 "닿다" 페이드인 (0.6초)
- 그 아래 한 줄 메시지 (랜덤 로테이션 4종):
  - "당신의 마음이 자녀에게 닿습니다"
  - "오늘의 글은, 그날에 닿습니다"
  - "마음은 묻혀 있어도 사라지지 않습니다"
  - "기다림이 곧 사랑이 됩니다"

-----

## 3. 기술 스택 & 환경

### 3.1 모바일 앱

- **프레임워크:** React Native + Expo **SDK 55** (★ 정확히 고정, "51+" 같은 모호한 표현 절대 금지)
- **언어:** TypeScript (strict 모드)
- **상태관리:** Zustand (전역) + TanStack Query (서버 상태)
- **스타일:** NativeWind (TailwindCSS for RN) + 커스텀 디자인 토큰
- **폼:** react-hook-form + zod
- **로컬 저장:** Expo SecureStore (토큰), MMKV (캐시)
- **알림:** Expo Notifications + 백엔드 cron (Supabase Edge Functions)
- **이미지:** expo-image (캐싱 최적화), expo-image-picker (선택)
- **결제:** 토스페이먼츠 (한국 신용카드 + 카카오페이 + 네이버페이) + RevenueCat (자동 갱신 관리)
- **분석:** Mixpanel (자녀 개인정보 *절대* 전송 금지, 익명 이벤트만)
- **에러 추적:** Sentry (스택트레이스만, 사용자 콘텐츠 마스킹)

### 3.1.1 ★ 패키지 설치 절대 규칙

**위반 시 빌드 전체가 무너진다.** Trace 프로젝트 실제 사고 사례:

- SDK 51 + 패키지 55.x 혼재 → 빌드 실패, 4시간 디버깅
- React 18/19 peer dependency 충돌
- Reanimated 4.x worklets 분리 미반영
- expo-av deprecated 헤더 누락

**필수 규칙:**

1. Expo 관련 패키지 설치/업데이트는 *반드시* `npx expo install <pkg>` — `npm install expo-xxx` 절대 금지
1. SDK 변경 시 4단계 의식:

   ```bash
   npm install expo@~XX.0.0 --legacy-peer-deps     # ① 코어 먼저
   NPM_CONFIG_LEGACY_PEER_DEPS=true npx expo install --fix   # ② 나머지 정렬
   npx expo prebuild --clean --platform ios         # ③ 네이티브 재생성
   cd ios && pod install --repo-update && cd ..     # ④ Pod 재설치
   ```
1. 모든 작업 종료 시 `npx expo-doctor` 통과 확인 — fail이면 사용자에게 즉시 보고
1. Xcode 캐시 의심 시: `rm -rf ~/Library/Developer/Xcode/DerivedData`
1. `--legacy-peer-deps`는 React 메이저 점프 시에만 한시적 사용. 평시 금지
1. `package.json`의 `expo` 버전과 `expo-xxx` 패키지의 메이저 *일치* 필수

### 3.1.2 ★ 금지된 deprecated 패키지

|금지 패키지                   |대체                         |사유                           |
|-------------------------|---------------------------|-----------------------------|
|`expo-av`                |`expo-audio` + `expo-video`|EXEventEmitter.h 헤더 삭제로 빌드 실패|
|`expo-permissions`       |각 모듈 내장 권한 API             |SDK 47부터 deprecated          |
|`expo-file-system/legacy`|`expo-file-system` (새 API) |레거시                          |

신규 패키지 추가 전 [reactnative.directory](https://reactnative.directory)에서 "Maintained" 확인.

### 3.2 백엔드

- **Supabase** (PostgreSQL + Auth + Realtime + Storage)
  - 자녀·캡슐 데이터: Supabase DB
  - 작은 이미지 (썸네일, 1MB 이하): Supabase Storage
- **★ 미디어 저장은 Cloudflare R2** (대용량, 저장 비용 1/10)
  - 원본 사진: R2
  - 영상 (V2): R2
- **Edge Functions** (Supabase): 캡슐 봉인·발송 cron, 결제 webhook
- **인증:** 카카오 로그인 (1차) + Apple Sign-In (필수) + 이메일 (보조)

### 3.3 인프라

- **배포:** EAS Build (iOS는 TestFlight → App Store)
- **CI/CD:** GitHub Actions (테스트만, 빌드는 EAS)
- **모니터링:** Sentry + Supabase Logs + Cloudflare Analytics
- **상태 페이지:** statuspage.io 또는 자체 정적 페이지 (§10 신뢰의 일부)

### 3.4 개발 환경 요구사항

```
node >= 20
npm (pnpm 사용 금지 — 단일 PM 원칙)
Xcode >= 26.5 (SDK 55 호환)
expo-cli, supabase-cli 글로벌 설치
EAS 계정
Cloudflare 계정 (R2)
토스페이먼츠 계정 (테스트 키)
```

★ **lockfile 단일화:** `package-lock.json`만 사용. `pnpm-lock.yaml`이 보이면 즉시 삭제.

### 3.5 보안 우선순위

- **자녀 데이터는 가장 민감한 자산.** 다른 모든 결정보다 우선
- RLS 정책: 모든 테이블, *예외 없이*
- 미디어 URL: 만료 토큰 (signed URL), 직접 접근 불가
- 비밀번호 재설정: 7일 cooldown (악의적 계정 탈취 방지)

-----

## 4. 사이트맵

```
스플래시 → 로그인 또는 온보딩
│
├─ 온보딩 (신규 사용자, 5단계)
│   ├─ 1. 환영 — "닿다는 당신과 자녀의 약속입니다"
│   ├─ 2. 약속 4가지 (§10) — 영원·고요·안전·닿음
│   ├─ 3. 자녀 등록 (이름·생일·성별·관계 [엄마/아빠/조부모])
│   ├─ 4. 체험 캡슐 작성 (가이드와 함께 첫 캡슐)
│   └─ 5. 로그인 (카카오·애플·이메일)
│
└─ 메인 (탭 3개)
    │
    ├─ 1️⃣ 캡슐  (홈탭)
    │   ├─ 상단: 다가오는 캡슐 카운트다운 (있을 때)
    │   ├─ 진행 중 (작성 중, 임시저장)
    │   ├─ 봉인됨 (대기 중, 카운트다운 표시)
    │   ├─ 열림 (자녀가 열어본 캡슐 — V2)
    │   └─ + 새 캡슐
    │       ├─ Step 1. 자녀 선택
    │       ├─ Step 2. 닿을 시점
    │       │   ├─ 마일스톤 (한국 절기·생일)
    │       │   │   ├─ 백일 / 돌
    │       │   │   ├─ 초등 입학 / 졸업
    │       │   │   ├─ 중·고등 입학 / 졸업
    │       │   │   ├─ 18세 성년식
    │       │   │   ├─ 수능 D-100
    │       │   │   ├─ 대학 입학
    │       │   │   ├─ 군 입대 전날 (남)
    │       │   │   ├─ 결혼식 전날
    │       │   │   └─ 30세 생일
    │       │   └─ 커스텀 날짜
    │       ├─ Step 3. 본문
    │       │   ├─ 제목 (선택)
    │       │   ├─ 본문 (텍스트, 최대 5,000자)
    │       │   └─ 사진 (최대 5장, V2에서 영상)
    │       └─ Step 4. 봉인 확인
    │           ├─ "이 캡슐은 [날짜]에 자녀에게 도착합니다"
    │           ├─ "봉인 후 수정·삭제 불가" 명시 (의도적 마찰)
    │           └─ 봉인 버튼 (길게 누르기 1초 — 실수 방지)
    │
    ├─ 2️⃣ 자녀
    │   ├─ 자녀 카드 목록
    │   │   ├─ 이름, 생일, D-day
    │   │   ├─ 다가오는 마일스톤 미리보기
    │   │   └─ "이 자녀에게 N개의 캡슐이 기다리고 있어요"
    │   ├─ 자녀 상세
    │   │   ├─ 프로필 (수정)
    │   │   ├─ 봉인된 캡슐 목록 (제목·발송일만, 내용 X — 봉인은 봉인)
    │   │   ├─ 마일스톤 캘린더 (시각화)
    │   │   └─ 미리보기 — "자녀가 받는 화면"
    │   └─ + 자녀 추가 (Premium은 무제한, Free 1명)
    │
    └─ 3️⃣ 나
        ├─ 프로필 (이름, 이메일, 가입일)
        ├─ 구독 상태 (§9)
        ├─ 신뢰 시스템 (§10)
        │   ├─ 영구 백업 (USB·이메일로 내보내기)
        │   ├─ 상속 관리자 지정 (배우자/지인 1명)
        │   └─ 회사 신뢰 페이지 (transparency report 링크)
        ├─ 알림 설정 (모두 opt-out 가능)
        ├─ 도움말 / 문의
        ├─ 약관 / 개인정보처리방침
        └─ 로그아웃 / 계정 삭제 (3단계 확인)
```

-----

## 5. 데이터 모델 (Supabase PostgreSQL)

### 5.1 핵심 테이블

```sql
-- 사용자 (auth.users 확장)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  inheritance_contact_id uuid references auth.users(id), -- 상속 관리자 (§10)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 자녀
create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  birthdate date not null,
  gender text check (gender in ('male', 'female', 'other')),
  relationship text not null default 'parent', -- parent | grandparent | guardian
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 캡슐
create table public.capsules (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,

  -- 콘텐츠
  title text,
  body text not null,

  -- 시점
  unlock_at timestamptz not null,
  milestone_key text, -- 'birthday_10', 'baekil', 'suneung_d100' 등. null이면 커스텀

  -- 상태
  is_sealed boolean default false, -- 봉인되면 author도 수정 불가
  is_delivered boolean default false,
  sealed_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz, -- 자녀가 열어본 시점 (V2)

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 캡슐 미디어 (분리, 캡슐당 여러 개)
create table public.capsule_media (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid not null references public.capsules(id) on delete cascade,
  kind text not null check (kind in ('photo', 'video', 'audio')),

  -- 저장 위치 (R2 또는 Supabase Storage)
  storage_provider text not null check (storage_provider in ('r2', 'supabase')),
  storage_key text not null, -- R2 객체 키 또는 Supabase path

  -- 메타데이터
  size_bytes bigint not null,
  mime_type text not null,
  width int,
  height int,
  duration_seconds int, -- 영상/오디오만

  -- 썸네일 (사진은 작은 버전, 영상은 첫 프레임)
  thumbnail_url text,

  order_index int default 0, -- 표시 순서
  created_at timestamptz default now()
);

-- 마일스톤 정의 (시스템 테이블, 코드에 박혀있어도 됨)
create table public.milestones (
  key text primary key, -- 'baekil', 'dol', 'suneung_d100' 등
  name_kr text not null,
  description text,
  -- 자녀 생일 기준 계산식 (예: '+100 days', '+1 year', '+18 years -1 day')
  offset_expr text not null,
  -- 성별 제한 (군입대는 'male'만)
  gender_filter text,
  display_order int default 0
);

-- 결제·구독 (RevenueCat과 sync)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('free', 'monthly', 'yearly', 'lifetime')),
  status text not null check (status in ('active', 'cancelled', 'expired', 'grace')),

  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,

  -- 외부 시스템 ID
  revenuecat_user_id text,
  toss_customer_id text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 회사 신뢰 — 분기별 상태 보고 (§10)
create table public.transparency_reports (
  id uuid primary key default gen_random_uuid(),
  quarter text not null, -- '2026Q2'
  total_users int not null,
  total_capsules int not null,
  total_storage_gb numeric not null,
  monthly_burn_krw bigint,
  runway_months numeric,
  published_at timestamptz default now()
);
```

### 5.2 RLS 정책

**모든 테이블 RLS 활성화. 예외 없음.**

```sql
-- profiles: 본인만 조회/수정
alter table public.profiles enable row level security;
create policy "본인 프로필만" on public.profiles for all using (id = auth.uid());

-- children: 부모만
alter table public.children enable row level security;
create policy "본인 자녀만" on public.children for all using (parent_id = auth.uid());

-- capsules: 작성자만 (V2에서 자녀 본인이 19세 이후 권한 인계받음)
alter table public.capsules enable row level security;
create policy "본인 캡슐만" on public.capsules for all using (author_id = auth.uid());

-- capsule_media: 캡슐 작성자만
alter table public.capsule_media enable row level security;
create policy "본인 캡슐의 미디어만" on public.capsule_media for all using (
  capsule_id in (select id from public.capsules where author_id = auth.uid())
);

-- 봉인된 캡슐 수정 차단 (DB 레벨 보호)
create policy "봉인된 캡슐 수정 금지" on public.capsules for update
  using (author_id = auth.uid() and is_sealed = false);
```

### 5.3 마일스톤 시스템

마일스톤 계산은 Edge Function에서:

```typescript
const MILESTONES = {
  baekil: { offset: '+100 days', name: '백일' },
  dol: { offset: '+1 year', name: '돌' },
  primary_entry: { offset: '+7 years', name: '초등학교 입학' },
  primary_grad: { offset: '+13 years', name: '초등학교 졸업' },
  middle_entry: { offset: '+13 years', name: '중학교 입학' },
  middle_grad: { offset: '+16 years', name: '중학교 졸업' },
  high_entry: { offset: '+16 years', name: '고등학교 입학' },
  suneung_d100: { offset: '+18 years -100 days', name: '수능 D-100' },
  age_18: { offset: '+18 years', name: '성년식 (만 18세)' },
  army_entry: { offset: '+20 years', name: '군 입대', gender: 'male' },
  wedding_eve: { offset: null, name: '결혼식 전날 (날짜 직접 지정)' },
  age_30: { offset: '+30 years', name: '서른' },
} as const;
```

생일 기반 자동 계산 + 사용자가 정확한 날짜 알 때 보정 가능 (예: 입학식 실제 날짜).

-----

## 6. 디자인 시스템

### 6.1 디자인 토큰

```typescript
// theme/tokens.ts
export const colors = {
  paper: '#FAF6EE',
  inkWarm: '#2B1F19',
  peach: '#E8927C',
  sage: '#8FA68E',
  goldWarm: '#C9A876',
  inkSoft: '#5C4F45',
  peachSoft: '#F4D5C9',
  error: '#A65A4F',     // 따뜻한 빨강 (Trace의 burgundy보다 부드럽게)
  success: '#8FA68E',   // sage와 동일
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64,
};

export const radii = {
  sm: 4,    // 버튼, 작은 카드
  md: 8,    // 입력 필드
  lg: 16,   // 큰 카드
  pill: 999, // pill 버튼 (제한적 사용)
};

export const fonts = {
  serif: 'NotoSerifKR-Medium',
  serifBold: 'NotoSerifKR-Bold',
  body: 'GowunDodum-Regular',
  hand: 'MaruBuri-Regular',     // 손글씨 액센트
  english: 'CormorantGaramond-Italic',
};

export const sizes = {
  xs: 11, sm: 13, base: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 32, hero: 48,
};
```

### 6.2 폰트 위계

|용도              |폰트                           |크기  |
|----------------|-----------------------------|----|
|헤더 (스크린 제목)     |Noto Serif KR Medium         |24px|
|카드 제목           |Noto Serif KR Medium         |17px|
|본문              |Gowun Dodum                  |15px|
|보조 텍스트          |Gowun Dodum                  |13px|
|메타정보 (날짜 등)     |Cormorant Garamond Italic    |13px|
|자녀 이름·캡슐 제목 *강조*|MaruBuri Regular (손글씨)       |20px|
|버튼 라벨           |Pretendard Medium (시스템 UI 한정)|15px|

★ **손글씨 폰트(MaruBuri)는 정서 지점에만.** 자녀 이름, 봉인 인장 텍스트("봉인되었습니다") 등. *대량 사용 금지* — 가독성 떨어짐.

### 6.3 카피 톤 가이드 — 절대 규칙

**금지 단어/표현:**

- ❌ "놓치셨네요" / "안 하신 지 N일" / "오늘도 비어있어요"
- ❌ "기록을 잊지 마세요" / "오늘의 메모를 작성하세요"
- ❌ "달성", "성공", "완료", "실패" — 캡슐은 점수가 아님
- ❌ "다른 부모님들은…" — 비교 금지
- ❌ 명령형 종결 ("작성하세요", "선택하세요") — 청유형 사용 ("작성해보실까요?")
- ❌ 이모지 (제품 UI에는 불가. 마케팅 콘텐츠는 별개)

**권장 표현:**

- ✅ "마음이 닿는 그날까지 기다립니다"
- ✅ "지금 떠오르는 한 마디가 평생 닿는 한 줄이 됩니다"
- ✅ "괜찮습니다. 마음은 어디에도 갑니다"
- ✅ "오늘 쓰지 않아도, 마음은 그대로입니다" (anti-FOMO)

**에러 메시지 카피:**

- 네트워크 실패 → "잠시 후 다시 닿게 해드릴게요"
- 저장 실패 → "잠시 멈췄어요. 다시 시도해보실까요"
- 로그인 실패 → "이메일이나 비밀번호를 다시 확인해주세요"
- 세션 만료 → "오랜만이시네요. 다시 들어오시겠어요?"

### 6.4 컴포넌트 규칙

**Primary 버튼:**

- 배경 peach, 텍스트 paper, 라운드 4px
- 풀너비 또는 충분한 패딩 (좌우 32px 이상)
- *그라데이션 금지*

**Secondary 버튼:**

- 테두리 inkWarm 1px, 배경 transparent, 텍스트 inkWarm
- 라운드 4px

**Tertiary 액션 (텍스트 링크):**

- 텍스트 peach, 밑줄 없음, hover/press 시 peachSoft 배경

**카드:**

- 배경 paper, 테두리 inkSoft 0.5px (매우 가는 선)
- 라운드 16px
- 그림자 금지 — *종이는 그림자 거의 없다*. 종이 위에 종이가 놓인 느낌

**입력 필드:**

- 밑줄 스타일 only (테두리 없음)
- 평소 inkSoft 1px, 포커스 시 peach 1.5px
- 라벨은 항상 위에, placeholder는 ink-soft 30% 투명

**모달:**

- 페이드인 + 살짝 위로 슬라이드 (0.3초)
- 닫기는 ESC, 외부 탭, 또는 명시적 X 버튼 (3가지 모두 지원)

### 6.5 봉인 인장 (시그니처 UI)

캡슐 봉인 순간 보여줄 *의례적 애니메이션* — 닿다의 시그니처 모먼트.

- peach 색 원형 인장 (직경 96px)
- 안에 "닿" 한 글자 (MaruBuri 손글씨 폰트, paper 색)
- 봉인 액션 시: 위에서 떨어지는 듯한 0.4초 애니메이션 + 부드러운 햅틱 피드백
- 봉인 후 캡슐 카드 우상단에 작은 인장 마크 (직경 24px) 표시

이건 *유료 사용자가 매주 보고 싶어할* 모먼트다. 디테일에 시간 써라.

-----

## 7. 핵심 UX 원칙 — Anti-FOMO

이 앱이 *살아남느냐*는 §7과 §10에 달려 있다.

### 7.1 우리는 사용자를 압박하지 않는다

**금지 패턴:**

- ❌ "N일째 캡슐을 작성하지 않으셨어요" 푸시
- ❌ "지난주 0개 작성" 같은 부재 강조
- ❌ 연속 일수, 스트릭, 뱃지, 레벨 — 어떤 형태의 게이미피케이션도 금지
- ❌ "다른 부모들은 평균 N개 작성" 비교 통계

**권장 패턴:**

- ✅ 자녀 생일 1주 전: *부드러운* 알림 한 번 ("[자녀이름]이의 생일이 다가오네요. 한 마디 남기시겠어요?")
- ✅ 한국 마일스톤 자동 노출 (백일·돌·입학 등 N일 전 *제안만*)
- ✅ 무활동은 *완전히 OK*. 1년에 1개도 충분하다는 톤
- ✅ "지난 1년간 [자녀]에게 닿을 캡슐 [N]개를 봉인하셨어요." — 분기별 *조용한* 회고만

### 7.2 봉인은 의례다

- 캡슐 봉인은 *되돌릴 수 없다* (수정·삭제 불가)
- 이건 버그가 아니라 *기능*이다. 한 번 보낸 편지는 회수할 수 없는 것과 같다
- 봉인 직전 "이 캡슐은 봉인 후 수정·삭제할 수 없습니다" 명확히 고지
- 봉인 버튼은 *길게 누르기 1초* (의도적 마찰)
- 봉인 직후 시그니처 애니메이션 (§6.5)

### 7.3 자녀 데이터는 신성하다

- 자녀 사진·이름·생일은 *어떤 분석·추천에도 사용 안 함*
- 광고는 영원히 없음. 닿다는 광고 모델로 가지 않는다
- 외부 SDK (Mixpanel, Sentry 등)에 자녀 콘텐츠 *절대* 전송 금지
- 이벤트 트래킹은 익명 사용 패턴만 (예: "사용자가 캡슐 봉인", 콘텐츠는 X)

### 7.4 미래에 닿는 경험은 약속이다

- 캡슐 발송일이 다가오면 자녀 측 알림 시스템 (V2에서 자녀 계정 도입)
- MVP에서는 *작성자에게* "내일 [자녀]에게 [N]년 전 캡슐이 도착합니다" 알림 → 작성자가 자녀에게 직접 보여줌
- 자녀가 미성년인 동안엔 *부모가 함께 열어보는* 의례 권장

-----

## 8. 핵심 기능 명세

### 8.1 캡슐 작성 흐름 (가장 중요)

**Step 1: 자녀 선택**

- 자녀가 1명이면 자동 선택 (스킵)
- 2명 이상이면 카드 형식 선택

**Step 2: 닿을 시점**

- 상단: "언제 닿게 할까요?"
- 마일스톤 그리드 (자녀 나이 기반 유효한 것만 표시)
  - 예: 자녀가 5세면 백일·돌은 회색(이미 지남), 초등 입학은 활성
- 마일스톤 카드: 이름 + D-day + 자녀의 *그때 나이*
- 하단: "원하는 날짜 직접 정하기"

**Step 3: 본문 작성**

- 큰 텍스트 입력 영역 (Gowun Dodum, 17px, 줄간격 1.7)
- 사진 첨부 (최대 5장, JPEG/HEIC, 자동 리사이즈)
- 자동저장 (3초마다, 임시저장)
- 글자 수 표시 (5,000자까지)

**Step 4: 봉인 확인**

- 큰 카드 표시:
  - 받을 사람: [자녀이름]
  - 닿을 시점: [날짜 + 마일스톤 + 그때 자녀 나이]
  - 본문 미리보기 (앞 50자)
  - 사진 개수
- 경고 박스 (peach 강조):
  - "봉인 후 수정·삭제할 수 없습니다."
  - "이건 약속입니다. 신중히 생각해보세요."
- 봉인 버튼 (길게 1초 누르기)
- 봉인 액션 시 §6.5 시그니처 애니메이션

### 8.2 자녀 관리

**무료:** 자녀 1명  
**Premium:** 무제한

자녀 정보:

- 이름 (한글 6자 또는 영문 30자 제한)
- 생일 (필수)
- 성별 (남/여/기타) — 마일스톤 필터링용 (군입대 등)
- 관계 (엄마/아빠/조부모/기타)

### 8.3 캡슐 보기 (작성자)

봉인된 캡슐은 *제목과 발송일만* 표시. 본문은 다시 못 봄.

이건 *기능*이다. 봉인은 봉인이다. 작성자도 다시 못 본다 = *닿는 그날의 의미*가 더 커진다.

(예외: V2에서 "프리미엄+" 플랜으로 *작성자 본인은 다시 보기 가능* 옵션 검토. 단, 메타정보로 "이 캡슐은 N번 미리 보셨습니다" 표시)

### 8.4 발송 (자동 시스템)

- Supabase Edge Function이 매일 0시(KST) cron으로 실행
- 그날 unlock_at에 도달한 캡슐 → is_delivered = true 처리
- 작성자에게 푸시 알림: "[자녀]에게 [N]년 전 캡슐이 도착했습니다. 함께 열어보시겠어요?"
- 캡슐 카드가 "열림" 섹션으로 이동
- 작성자가 자녀와 함께 앱에서 열어봄 (의례적 모먼트)

### 8.5 마일스톤 캘린더 (자녀 상세 화면)

자녀별로 *앞으로 다가올 마일스톤*을 타임라인 형식으로 표시:

```
[자녀 이름] 김도윤 (2024년 3월 15일생, 만 2세)

  ─●─ 백일       2024.06.23 (지남)
  ─●─ 돌         2025.03.15 (지남)
  ─○─ 초등 입학   2031.03.04 (D-1,852)
       └ 캡슐 0개
  ─○─ 18세 생일   2042.03.15 (D-5,853)
       └ 캡슐 0개
  ...
```

각 마일스톤에 캡슐이 봉인돼 있으면 *작은 인장* 마크 표시.

### 8.6 영구 백업 (★ 신뢰 시스템의 핵심, §10)

언제든 모든 캡슐을 *내보내기* 가능:

- PDF: 캡슐 본문 + 메타정보 + 사진 (인쇄용)
- ZIP: 모든 미디어 원본 + JSON 메타데이터
- 이메일로 전송 (선택)
- USB 마운트 시 직접 저장 (V2)

★ 이 기능은 *항상 무료* 영원히. 사용자가 *벤더 락인 없이* 떠날 수 있어야 한다.

-----

## 9. 결제 및 구독

### 9.1 플랜

|플랜         |가격       |자녀 수|캡슐   |저장   |AI 가이드 (V2)|영구|
|-----------|---------|----|-----|-----|-----------|--|
|**무료**     |0원       |1명  |평생 1개|100MB|X          |- |
|**프리미엄 월간**|4,900원/월 |무제한 |무제한  |50GB |O          |X |
|**프리미엄 연간**|49,000원/년|무제한 |무제한  |50GB |O          |X |
|**평생 플랜**  |399,000원 |무제한 |무제한  |100GB|O          |평생|

### 9.2 무료 → 유료 전환 트리거

1. 두 번째 자녀 추가 시도 → 결제 화면
1. 두 번째 캡슐 작성 완료 (봉인 직전) → 결제 화면
1. 100MB 저장 한도 도달 → 결제 화면

★ **무료 캡슐 1개는 *반드시 만들 수 있게* 한다.** 한 번 만든 캡슐은 *영원히 보장*. 결제 안 해도 사라지지 않는다 (신뢰 약속).

### 9.3 결제 수단

- **토스페이먼츠** (1차) — 한국 신용카드, 카카오페이, 네이버페이
- **In-App Purchase** (필수, iOS 정책) — App Store 결제 → RevenueCat 통해 동기화
- **연간/평생은 외부 결제 권장** (수수료 절약), App Store는 월간만

### 9.4 환불·취소

- 월간/연간: 언제든 취소 가능. 이미 결제된 기간은 환불 X (단, 첫 결제 후 24시간 내 100% 환불)
- 평생: 30일 환불 보장
- 취소 시 *데이터는 영구 보관*. 다시 가입해도 그대로 (신뢰 약속)
- 무료 다운그레이드: 봉인된 캡슐 *모두 그대로*. 다만 새 캡슐 생성은 1개 한도

-----

## 10. ★ 신뢰 시스템

**이게 살아남는 차별점이다.** "20년 뒤에도 닿을 거라는 약속"이 *진짜로* 지켜질 거라고 사용자가 믿어야 한다.

### 10.1 4겹 약속

1. **언제든 내보내기** (§8.6) — 모든 데이터를 PDF·ZIP으로 즉시 다운로드. *벤더 락인 없음*
1. **회사 해산 자동 발송** — 6개월 동결 감지 시 모든 봉인 캡슐을 등록 이메일로 *자동 발송*하는 법적 약정
1. **상속 관리자 지정** — 부모가 사망 시 캡슐을 인계받을 사람 1명 미리 지정 가능
1. **분기별 transparency report** — 가입자 수, 보관 캡슐 수, 회사 재무 상태, 런웨이 *공개*

### 10.2 첫 화면 약속 (온보딩)

온보딩 Step 2에 4가지 약속을 *명시적으로* 보여준다:

```
당신의 캡슐은
─────────────

영원합니다
  └ 회사가 사라져도 캡슐은 사라지지 않습니다

비공개입니다
  └ 가족 외 누구도 보지 못합니다. 저희도 봅니다 (V2: 못 봅니다, E2E 암호화)

언제든 가져갈 수 있습니다
  └ 모든 캡슐을 즉시 PDF·USB로 내보낼 수 있습니다

자녀에게 닿습니다
  └ 부모님이 사망하셔도 미리 지정한 가족이 인계받습니다
```

### 10.3 "회사가 망하면" 시나리오 — 법적 장치

`/legal/sunset-policy` 정적 페이지로 *명시*:

> 닿다가 6개월간 정상 서비스를 유지하지 못할 경우:
>
> 1. 모든 봉인된 캡슐이 작성자의 등록 이메일로 자동 발송됩니다 (PDF + ZIP)
> 1. 발송 비용은 회사 청산금에서 우선 차감됩니다
> 1. 이 약정은 법률 자문을 거쳐 명문화되어 있습니다

V2에서 *제3자 에스크로* 도입 검토 (변호사 또는 은행에 데이터 사본 보관 + 자동 발송 트리거).

### 10.4 Transparency Report

분기마다 자동 게시:

```
2026년 2분기 (4-6월)
━━━━━━━━━━━━━━━━━━

  가입자          1,247명
  봉인된 캡슐      8,924개
  저장 미디어      234 GB

  월간 운영 비용   ₩4,200,000
  월간 매출       ₩8,910,000
  현금 보유       ₩42,000,000
  런웨이          10개월

  새로운 약속
  ─────────
  - 7월 중 E2E 암호화 도입
  - 9월 중 평생 플랜 출시
```

투명함이 신뢰가 된다. 숨길 게 없어야 한다.

-----

## 11. MVP 스프린트 (8주)

### Sprint 1 (1주차) — 기반 + 브랜드

- [ ] **★ Expo SDK 55 정확히 명시한 프로젝트 셋업**
- [ ] **★ `npx expo-doctor` 통과 확인** (0 fail)
- [ ] EAS 빌드 환경 (eas.json, Apple 계정 연동)
- [ ] **★ iOS 빌드 1회 성공** (시뮬레이터에 빈 화면이라도) — 이게 안 되면 다음 작업 보류
- [ ] Supabase 프로젝트 + 모든 테이블 + RLS 정책
- [ ] Cloudflare R2 버킷 + signed URL 발급 Edge Function
- [ ] **★ 브랜드 자산 SVG** (워드마크 4종 + 모노그램 3종 + 앱 아이콘 모든 사이즈)
- [ ] **★ 폰트 임베드** (Noto Serif KR, Gowun Dodum, MaruBuri, Cormorant Garamond)
- [ ] **★ `<Wordmark>`, `<Monogram>` 컴포넌트** + 디자인 토큰
- [ ] 핵심 UI 컴포넌트 5종 (Button, Card, Input, ImagePicker, MilestoneCard)
- [ ] **★ 스플래시 스크린** (워드마크 페이드인 + 랜덤 메시지)

### Sprint 2 (2-3주차) — 인증 + 자녀 관리

- [ ] 카카오 / Apple Sign-In / 이메일 로그인
- [ ] 온보딩 5단계 (환영 → 약속 → 자녀 등록 → 체험 캡슐 → 로그인)
- [ ] 자녀 CRUD (등록·수정·삭제)
- [ ] 자녀 카드 UI + D-day 계산
- [ ] 마일스톤 정의 (10개) + 자녀별 캘린더 뷰
- [ ] 약속 4가지 *정적 페이지*도 함께 (§10)

### Sprint 3 (4-5주차) — 캡슐 작성 + 봉인

- [ ] 새 캡슐 4단계 마법사 (자녀 → 시점 → 본문 → 봉인)
- [ ] 마일스톤/커스텀 날짜 선택 UI
- [ ] 본문 에디터 + 자동저장
- [ ] 사진 첨부 (최대 5장) + 자동 리사이즈
- [ ] R2 업로드 (signed URL)
- [ ] **★ 봉인 시그니처 애니메이션** (§6.5)
- [ ] 봉인 후 수정 차단 (DB RLS + 클라이언트 UI)

### Sprint 4 (6주차) — 캡슐 보기 + 발송

- [ ] 캡슐 탭 (진행 중 / 봉인됨 / 열림)
- [ ] 봉인된 캡슐은 제목·발송일만 표시 (본문 X)
- [ ] Edge Function cron: 매일 00:00 KST 발송 처리
- [ ] 발송 알림 (작성자에게 푸시)
- [ ] 발송된 캡슐 열어보기 UI (자녀와 함께 보는 의례)

### Sprint 5 (7주차) — 결제 + 신뢰 시스템

- [ ] 토스페이먼츠 연동 (월간/연간/평생)
- [ ] In-App Purchase + RevenueCat 동기화
- [ ] 결제 화면 + 플랜 비교
- [ ] **★ 영구 백업** (PDF + ZIP 내보내기) — §10 핵심
- [ ] 상속 관리자 지정 UI
- [ ] 첫 transparency report 게시

### Sprint 6 (8주차) — 다듬기 + 출시 준비

- [ ] App Store 메타데이터 (스크린샷, 카피, 키워드)
- [ ] 약관·개인정보·사용자 권리 페이지
- [ ] 알림 설정 (모두 opt-out 가능)
- [ ] 분석 (Mixpanel) — *자녀 콘텐츠 절대 전송 금지* 검증
- [ ] 에러 추적 (Sentry) — 사용자 콘텐츠 마스킹
- [ ] TestFlight 베타 (친구·가족 30명)
- [ ] *피드백 받고* 다듬기 — 출시는 *피드백 후*

### V2 (출시 후 3개월 내)

- AI 작성 가이드 (자녀 나이별 prompt)
- 영상 캡슐 (Cloudflare Stream 또는 R2 + HLS)
- 음성 캡슐 (녹음 + Whisper STT 본문 자동 변환)
- 부부 공동 작성 (한 캡슐을 둘이 함께)
- E2E 암호화 (서버도 못 보게)
- 자녀 본인 계정 (만 14세 이상, 자녀가 직접 열어보는 경험)
- 인쇄 책자 출판 (Storyworth 모델)

-----

## 12. 분석 및 측정

### 12.1 핵심 지표

|지표          |목표 (3개월)|목표 (1년)|
|------------|--------|-------|
|다운로드        |5,000   |50,000 |
|가입자         |2,000   |25,000 |
|활성 사용자 (월간) |800     |10,000 |
|유료 전환율      |8%      |15%    |
|평균 캡슐/사용자   |2       |8      |
|첫 캡슐 봉인까지 시간|< 24시간  |< 12시간 |
|월간 이탈률      |< 10%   |< 5%   |

### 12.2 핵심 funnel

1. 다운로드 → 온보딩 시작 (목표 95%)
1. 온보딩 시작 → 첫 캡슐 봉인 (목표 60%)
1. 첫 캡슐 봉인 → 두 번째 캡슐 시도 (목표 40% → 이게 유료 전환의 핵심)
1. 두 번째 캡슐 시도 → 유료 결제 (목표 30%)

### 12.3 이벤트 (자녀 콘텐츠 절대 미포함)

```typescript
// 익명 이벤트 명세
track('capsule_started', { milestone_key: 'baekil' });  // OK
track('capsule_sealed', { has_photos: true, photo_count: 3, milestone_key: 'age_18' });  // OK
track('upgrade_clicked', { trigger: 'second_child' });  // OK

// 절대 금지
track('capsule_sealed', { body: '...자녀에게 보낸 편지 내용...' });  // ❌❌❌
track('child_added', { name: '김도윤' });  // ❌❌❌
```

-----

## 13. 카피 가이드 (마케팅·UI 공통)

### 13.1 보이스

- 친밀하지만 끈적하지 않게
- 따뜻하지만 감상적이지 않게
- 약속을 지키는 사람의 어조
- 시적이되 모호하지 않게

### 13.2 핵심 카피 모음

**앱 스토어 설명:**

> 닿다는 오늘의 마음을, 자녀가 자라난 어느 날에 닿게 합니다.
>
> 백일에, 첫 등교 날에, 수능 전날에, 결혼식 전날에 — 그 순간을 위해 미리 봉인된 한 마디.
>
> 한 번 봉인하면 수정도 삭제도 할 수 없습니다. 그게 약속의 무게입니다.

**랜딩 페이지 헤드라인:**

> "오늘의 한 줄이, 그날의 평생이 됩니다."

**온보딩 환영:**

> 닿다에 오신 것을 환영합니다.
>
> 지금부터 당신과 자녀 사이에 *작은 약속*을 시작합니다.

**첫 캡슐 봉인 직전:**

> 잠깐, 신중히 생각해보세요.
>
> 이 캡슐은 [날짜]에 [자녀 이름]에게 닿습니다.
> 봉인 후에는 수정도 삭제도 할 수 없어요.
>
> 그래도 괜찮으시다면, 길게 눌러서 봉인해주세요.

**봉인 직후:**

> 봉인되었습니다.
>
> 당신의 마음은 [자녀 이름]에게,
> [N년 N개월] 후에 닿습니다.

-----

## 14. 향후 로드맵 (출시 후)

### V2 (3개월 내)

- 영상·음성 캡슐
- AI 작성 가이드
- 부부 공동 작성
- 자녀 본인 계정 (만 14세+)

### V3 (6개월 내)

- 인쇄 책자 출판 (Storyworth 모델, ~99,000원 1권)
- E2E 암호화
- 해외 진출 (영문 버전) — 일본·대만 우선

### V4 (1년 내)

- 가족 트리 (조부모·이모·삼촌도 자녀에게 캡슐)
- 자녀가 열어볼 *전용 앱* (만 14세+)
- 학교·기관용 API (졸업 시 학생에게 단체 캡슐)

-----

## 15. Claude Code 작업 시 체크리스트

**매 작업 시작 전:**

- [ ] 이 문서를 읽었는가?
- [ ] 작업 범위가 명확한가? 모호하면 사용자에게 질문
- [ ] §7 Anti-FOMO 원칙에 위배되지 않는가?
- [ ] §10 신뢰 시스템에 영향을 주는가? (주의 깊게)
- [ ] §2 브랜드 규칙에 위배되지 않는가?
- [ ] §3.1.1 패키지 설치 규칙 준수? (`npx expo install` 사용)
- [ ] 자녀 콘텐츠가 외부 SDK로 *절대* 전송되지 않는가?
- [ ] 데이터베이스 변경이라면 RLS 정책도 함께 수정?
- [ ] 작업 후 한국어 커밋 메시지 작성?

**★ 패키지 설치/업데이트 시 특별 주의:**

- [ ] `npm install expo-xxx` 사용하지 않았는가? (반드시 `npx expo install`)
- [ ] §3.1.2의 deprecated 패키지 목록 확인했는가?
- [ ] 설치 후 `npx expo-doctor` 통과 확인?
- [ ] 새 네이티브 패키지면 `npx expo prebuild --clean` 실행했는가?
- [ ] iOS 빌드까지 통과 확인했는가? (시뮬레이터 실행)
- [ ] 위 작업 중 하나라도 실패하면 임의 진행 금지

**매 PR 전:**

- [ ] 타입 에러 0
- [ ] Lint 에러 0
- [ ] 단위 테스트 통과
- [ ] **★ `npx expo-doctor` 0 fail**
- [ ] **★ iOS 시뮬레이터 빌드 성공**
- [ ] 카피 톤 가이드 (§6.3, §13) 준수
- [ ] 폰트 위계 가이드 (§6.2) 준수
- [ ] 다크모드 동작 확인 (자동 inversion이 *브랜드 색 어색하게* 만들지 않는지)
- [ ] 접근성: 폰트 크기 확대 시 깨지지 않음
- [ ] 워드마크/모노그램 사용 시 §2.4 규칙 준수
- [ ] 분석 이벤트가 자녀 콘텐츠를 *절대* 포함하지 않음 (§12.3)

-----

**이 문서가 진실의 근원이다.**  
**의심스러우면 이 문서를 먼저 보고, 그래도 불명확하면 질문하라.**  
**닿다는 약속이다. 모든 결정은 그 약속을 지키는 방향이어야 한다.**  
**패키지 설치는 §3.1.1을 반드시 따르라. SDK 버전 불일치는 4시간 빚을 만든다.**  
**자녀 데이터는 신성하다. §7.3을 절대 위반하지 마라.**
