-- 닿다 push token 보관 (§3.1 Expo Notifications + §7.4 부드러운 알림)
-- 알림은 마일스톤·자녀 생일·캡슐 도착에만 — §0 "부모를 압박하지 마라" 정신 유지.

create table if not exists public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  expo_push_token text not null,
  device_id text,
  platform text check (platform in ('ios', 'android', 'web')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, expo_push_token)
);

create index if not exists push_tokens_user_idx on public.push_tokens(user_id);

alter table public.push_tokens enable row level security;

create policy "본인 push 토큰 조회" on public.push_tokens
  for select using (user_id = auth.uid());

create policy "본인 push 토큰 upsert" on public.push_tokens
  for insert with check (user_id = auth.uid());

create policy "본인 push 토큰 수정" on public.push_tokens
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "본인 push 토큰 삭제" on public.push_tokens
  for delete using (user_id = auth.uid());

create trigger push_tokens_set_updated_at before update on public.push_tokens
  for each row execute function public.set_updated_at();
