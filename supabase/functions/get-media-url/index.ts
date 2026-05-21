// Cloudflare R2 다운로드용 signed GET URL 발급 Edge Function.
//
// 흐름:
//   1) 클라이언트가 media_id를 보냄
//   2) JWT로 사용자 검증 → capsule_media → capsule.author_id == user.id 인지 RLS로 확인
//   3) R2 signed GET URL(15분) 반환
//
// 미디어 다운로드는 §10.1 영구 백업 + §8.4 발송 후 자녀와 함께 열어보기에 사용.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { S3Client, GetObjectCommand } from 'npm:@aws-sdk/client-s3@3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${Deno.env.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID') ?? '',
    secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY') ?? '',
  },
});

const R2_BUCKET = Deno.env.get('R2_BUCKET') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  let body: { media_id?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const mediaId = body.media_id;
  if (!mediaId) return json({ error: 'media_id 필요' }, 400);

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Unauthorized' }, 401);

  // RLS가 본인 캡슐의 미디어만 통과시킴
  const { data: media, error: mediaError } = await userClient
    .from('capsule_media')
    .select('id, storage_provider, storage_key')
    .eq('id', mediaId)
    .single();

  if (mediaError || !media) {
    return json({ error: '미디어를 찾을 수 없거나 권한이 없습니다' }, 403);
  }

  if (media.storage_provider !== 'r2') {
    return json({ error: 'R2 외 스토리지는 아직 지원하지 않습니다' }, 400);
  }

  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: media.storage_key }),
    { expiresIn: 900 }
  );

  return json({ url, expires_in: 900 }, 200);
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
  });
}
