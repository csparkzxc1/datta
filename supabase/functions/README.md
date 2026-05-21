# Supabase Edge Functions

## 배포

```bash
supabase functions deploy get-upload-url
supabase functions deploy deliver-capsules

# 시크릿 등록 (Cloudflare R2)
supabase secrets set R2_ACCOUNT_ID=xxx
supabase secrets set R2_ACCESS_KEY_ID=xxx
supabase secrets set R2_SECRET_ACCESS_KEY=xxx
supabase secrets set R2_BUCKET=datta-media

# SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY는 supabase가 자동 주입.
```

## cron 등록 (deliver-capsules)

매일 00:00 KST에 캡슐 발송 처리. UTC 기준 15:00:

```sql
-- pg_cron + pg_net (Supabase 대시보드 > Database > Extensions에서 활성화)
select cron.schedule(
  'deliver-capsules',
  '0 15 * * *',
  $$
    select net.http_post(
      url := 'https://<project>.supabase.co/functions/v1/deliver-capsules',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer <service-role-key>'
      ),
      body := '{}'::jsonb
    );
  $$
);
```

## get-upload-url

R2에 미디어 업로드용 signed PUT URL을 발급합니다. JWT로 인증한 사용자가 본인의 *미봉인* 캡슐에만 업로드할 수 있습니다(§7.2 봉인 의례 약속).

**요청 (POST):**
```json
{
  "capsule_id": "uuid",
  "content_type": "image/jpeg",
  "ext": "jpg"
}
```

**응답 (200):**
```json
{
  "url": "https://...r2.cloudflarestorage.com/...?X-Amz-Signature=...",
  "key": "capsules/{capsule_id}/{uuid}.jpg",
  "expires_in": 600
}
```

**거부 (403):**
- 캡슐이 본인 소유가 아님 (RLS)
- 캡슐이 이미 봉인됨

**클라이언트 흐름:**
1. function 호출 → url + key 받음
2. `fetch(url, { method: 'PUT', body: file, headers: { 'content-type': ... } })`
3. 성공 후 `capsule_media` 행 INSERT (`storage_provider='r2'`, `storage_key=key`)

이 흐름은 `lib/r2-upload.ts`의 `uploadCapsuleMedia()`에 구현돼 있습니다.

## deliver-capsules

매일 cron으로 호출. 봉인된 채 `unlock_at`에 도달한 캡슐을 `is_delivered=true`로 전환합니다(§8.4).

- service role로 호출되어야 합니다 (RLS 우회 필요).
- 작성자에게 푸시 알림 발송은 Expo Push 토큰 보관 테이블 도입 후 활성화 예정 (TODO 주석).
