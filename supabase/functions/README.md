# Supabase Edge Functions

## 배포

```bash
supabase functions deploy get-upload-url

# 시크릿 등록 (Cloudflare R2)
supabase secrets set R2_ACCOUNT_ID=xxx
supabase secrets set R2_ACCESS_KEY_ID=xxx
supabase secrets set R2_SECRET_ACCESS_KEY=xxx
supabase secrets set R2_BUCKET=datta-media

# SUPABASE_URL, SUPABASE_ANON_KEY는 supabase가 자동 주입.
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
