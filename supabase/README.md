# Supabase

## 적용

```bash
# 프로젝트 root
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

## 마이그레이션

- `migrations/20260520000001_init.sql` — 초기 스키마 (CLAUDE.md §5 기준).

## RLS 핵심 약속

`§7.2`의 *봉인은 의례, 되돌릴 수 없다* 약속은 DB 레벨에서 다음 정책으로 보장됩니다:

- `capsules` UPDATE: `using` 조건이 `is_sealed = false` — 현재 행이 미봉인 상태일 때만 수정 가능. 한 번 `is_sealed = true`가 되면 어떤 UPDATE도 차단됨.
- `capsules` DELETE: 동일하게 미봉인 상태일 때만 삭제 가능.
- `capsule_media`: 부모 capsule이 미봉인일 때만 INSERT/DELETE 가능.

클라이언트 코드 버그로 봉인된 캡슐 수정을 시도해도 DB가 차단합니다.

## 시드

`milestones` 테이블은 12개 마일스톤이 자동 seed되며, 마이그레이션 재실행 시 `on conflict do update`로 안전하게 동기화됩니다.
