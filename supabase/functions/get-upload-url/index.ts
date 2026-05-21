// Cloudflare R2 업로드용 signed PUT URL 발급 Edge Function.
// CLAUDE.md §3.2 — 미디어 저장은 R2.
//
// 흐름:
//   1) 클라이언트가 capsule_id, content_type, ext를 보냄
//   2) function이 JWT로 사용자 검증 → 본인의 미봉인 캡슐인지 확인 (RLS)
//   3) capsules/{capsule_id}/{uuid}.{ext} 형식 키 생성
//   4) R2 signed PUT URL(10분) 반환
//   5) 클라이언트가 R2에 직접 PUT 후, capsule_media 행 INSERT
//
// 봉인된 캡슐의 미디어 업로드는 차단됨(§7.2).

import { createClient } from 'npm:@supabase/supabase-js@2';
import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3@3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3';

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
]);

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

type Body = {
  capsule_id?: string;
  content_type?: string;
  ext?: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { capsule_id, content_type, ext } = body;
  if (!capsule_id || !content_type || !ext) {
    return json({ error: 'capsule_id, content_type, ext 모두 필요합니다' }, 400);
  }

  if (!ALLOWED_CONTENT_TYPES.has(content_type)) {
    return json({ error: '지원하지 않는 파일 형식' }, 400);
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  // RLS로 본인 캡슐만 조회됨. 봉인 여부 확인.
  const { data: capsule, error: capsuleError } = await userClient
    .from('capsules')
    .select('id, is_sealed')
    .eq('id', capsule_id)
    .single();

  if (capsuleError || !capsule) {
    return json({ error: '캡슐을 찾을 수 없거나 권한이 없습니다' }, 403);
  }
  if (capsule.is_sealed) {
    return json({ error: '봉인된 캡슐에는 미디어를 추가할 수 없습니다' }, 403);
  }

  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5) || 'bin';
  const key = `capsules/${capsule_id}/${crypto.randomUUID()}.${safeExt}`;

  const url = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: content_type,
    }),
    { expiresIn: 600 }
  );

  return json({ url, key, expires_in: 600 }, 200);
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
  });
}
