-- 닿다 (Datta) — 초기 스키마
-- CLAUDE.md §5.1, §5.2, §5.3 기준
-- 봉인된 캡슐의 수정·삭제 불가 약속(§7.2)을 RLS using/with check로 DB 레벨 보장.

-- ============================================================
-- 1. profiles (auth.users 확장)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  inheritance_contact_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auth.users insert 시 profiles 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', '익명'),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. children
-- ============================================================
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  birthdate date not null,
  gender text check (gender in ('male', 'female', 'other')),
  relationship text not null default 'parent',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists children_parent_idx on public.children(parent_id);

-- ============================================================
-- 3. capsules
-- ============================================================
create table if not exists public.capsules (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  title text,
  body text not null,
  unlock_at timestamptz not null,
  milestone_key text,
  is_sealed boolean not null default false,
  is_delivered boolean not null default false,
  sealed_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists capsules_author_idx on public.capsules(author_id);
create index if not exists capsules_child_idx on public.capsules(child_id);
create index if not exists capsules_delivery_idx
  on public.capsules(unlock_at)
  where is_sealed = true and is_delivered = false;

-- ============================================================
-- 4. capsule_media
-- ============================================================
create table if not exists public.capsule_media (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid not null references public.capsules(id) on delete cascade,
  kind text not null check (kind in ('photo', 'video', 'audio')),
  storage_provider text not null check (storage_provider in ('r2', 'supabase')),
  storage_key text not null,
  size_bytes bigint not null,
  mime_type text not null,
  width int,
  height int,
  duration_seconds int,
  thumbnail_url text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists capsule_media_capsule_idx on public.capsule_media(capsule_id);

-- ============================================================
-- 5. milestones (시스템 테이블, 시드 데이터)
-- ============================================================
create table if not exists public.milestones (
  key text primary key,
  name_kr text not null,
  description text,
  offset_expr text,
  gender_filter text,
  display_order int not null default 0
);

insert into public.milestones (key, name_kr, description, offset_expr, gender_filter, display_order) values
  ('baekil',         '백일',          '태어난 지 100일',          '+100 days',                 null,    10),
  ('dol',            '돌',            '첫 생일',                  '+1 year',                   null,    20),
  ('primary_entry',  '초등학교 입학',  '7세 봄',                   '+7 years',                  null,    30),
  ('primary_grad',   '초등학교 졸업',  '13세 봄',                  '+13 years',                 null,    40),
  ('middle_entry',   '중학교 입학',    '13세 봄',                  '+13 years',                 null,    50),
  ('middle_grad',    '중학교 졸업',    '16세 봄',                  '+16 years',                 null,    60),
  ('high_entry',     '고등학교 입학',  '16세 봄',                  '+16 years',                 null,    70),
  ('suneung_d100',   '수능 D-100',     '18세 가을, 수능 100일 전', '+18 years -100 days',       null,    80),
  ('age_18',         '성년식 (만 18세)','만 18세 생일',             '+18 years',                 null,    90),
  ('army_entry',     '군 입대',        '만 20세 무렵',             '+20 years',                 'male',  100),
  ('wedding_eve',    '결혼식 전날',    '날짜 직접 지정',           null,                        null,    110),
  ('age_30',         '서른',          '만 30세 생일',             '+30 years',                 null,    120)
on conflict (key) do update set
  name_kr = excluded.name_kr,
  description = excluded.description,
  offset_expr = excluded.offset_expr,
  gender_filter = excluded.gender_filter,
  display_order = excluded.display_order;

-- ============================================================
-- 6. subscriptions
-- ============================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('free', 'monthly', 'yearly', 'lifetime')),
  status text not null check (status in ('active', 'cancelled', 'expired', 'grace')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  revenuecat_user_id text,
  toss_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_idx on public.subscriptions(user_id);

-- ============================================================
-- 7. transparency_reports (§10.4)
-- ============================================================
create table if not exists public.transparency_reports (
  id uuid primary key default gen_random_uuid(),
  quarter text not null unique,
  total_users int not null,
  total_capsules int not null,
  total_storage_gb numeric not null,
  monthly_burn_krw bigint,
  runway_months numeric,
  published_at timestamptz not null default now()
);

-- ============================================================
-- RLS — 모든 테이블, 예외 없음 (§5.2, §3.5)
-- ============================================================

-- profiles
alter table public.profiles enable row level security;
create policy "본인 프로필 조회" on public.profiles
  for select using (id = auth.uid());
create policy "본인 프로필 수정" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
-- insert는 trigger(handle_new_user)가 처리하므로 별도 정책 불필요.
-- delete는 auth.users on delete cascade로 처리.

-- children
alter table public.children enable row level security;
create policy "본인 자녀 조회" on public.children
  for select using (parent_id = auth.uid());
create policy "본인 자녀 생성" on public.children
  for insert with check (parent_id = auth.uid());
create policy "본인 자녀 수정" on public.children
  for update using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy "본인 자녀 삭제" on public.children
  for delete using (parent_id = auth.uid());

-- capsules — 봉인된 캡슐은 수정·삭제 불가 (§7.2)
alter table public.capsules enable row level security;

create policy "본인 캡슐 조회" on public.capsules
  for select using (author_id = auth.uid());

create policy "본인 캡슐 생성" on public.capsules
  for insert with check (author_id = auth.uid() and is_sealed = false);

-- using: 현재 행이 미봉인 → update 가능
-- with check: 새 값의 author_id만 본인. is_sealed=true로 변경하는 봉인 액션은 허용.
create policy "본인 캡슐 수정 (봉인 전만)" on public.capsules
  for update
  using (author_id = auth.uid() and is_sealed = false)
  with check (author_id = auth.uid());

create policy "본인 캡슐 삭제 (봉인 전만)" on public.capsules
  for delete using (author_id = auth.uid() and is_sealed = false);

-- capsule_media — 캡슐과 동일한 봉인 정책
alter table public.capsule_media enable row level security;

create policy "본인 캡슐 미디어 조회" on public.capsule_media
  for select using (
    capsule_id in (select id from public.capsules where author_id = auth.uid())
  );

create policy "본인 캡슐 미디어 생성 (봉인 전만)" on public.capsule_media
  for insert with check (
    capsule_id in (
      select id from public.capsules
      where author_id = auth.uid() and is_sealed = false
    )
  );

create policy "본인 캡슐 미디어 삭제 (봉인 전만)" on public.capsule_media
  for delete using (
    capsule_id in (
      select id from public.capsules
      where author_id = auth.uid() and is_sealed = false
    )
  );

-- milestones — 누구나 읽기 가능 (시스템 테이블)
alter table public.milestones enable row level security;
create policy "마일스톤 공개 조회" on public.milestones
  for select using (true);

-- subscriptions — 본인 조회만 (수정은 webhook이 service role로 처리)
alter table public.subscriptions enable row level security;
create policy "본인 구독 조회" on public.subscriptions
  for select using (user_id = auth.uid());

-- transparency_reports — 누구나 읽기 가능 (§10.4 공개 약속)
alter table public.transparency_reports enable row level security;
create policy "투명성 리포트 공개 조회" on public.transparency_reports
  for select using (true);

-- ============================================================
-- updated_at 자동 갱신 trigger (공통)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger children_set_updated_at before update on public.children
  for each row execute function public.set_updated_at();
create trigger capsules_set_updated_at before update on public.capsules
  for each row execute function public.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
