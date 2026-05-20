-- §10.1 상속 관리자 지정 — 부모가 사망 시 캡슐을 인계받을 사람.
-- 닿다 사용자가 아닐 수도 있어서 이름·이메일·전화 자유 입력 컬럼으로.

alter table public.profiles add column if not exists inheritance_contact_name text;
alter table public.profiles add column if not exists inheritance_contact_email text;
alter table public.profiles add column if not exists inheritance_contact_phone text;
alter table public.profiles add column if not exists inheritance_contact_note text;
