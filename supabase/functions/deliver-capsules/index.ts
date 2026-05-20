// 매일 00:00 KST cron으로 호출되어, 봉인된 채 unlock_at에 도달한 캡슐을
// is_delivered=true로 전환하고 작성자에게 푸시 알림을 보낼 수 있는 Edge Function.
//
// CLAUDE.md §3.2, §8.4 — Supabase Edge Functions의 캡슐 봉인·발송 cron.
//
// 배포 후 cron 등록:
//   supabase functions schedule deliver-capsules --cron "0 15 * * *"
//   (UTC 15:00 = KST 00:00)
//
// 또는 pg_cron + pg_net으로 호출:
//   select cron.schedule('deliver-capsules', '0 15 * * *',
//     $$ select net.http_post('https://<project>.supabase.co/functions/v1/deliver-capsules',
//          '{}'::jsonb, '{"Authorization":"Bearer <service-role-key>"}'::jsonb) $$);

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

Deno.serve(async (req) => {
  // service role로 호출되어야 함. 내부 cron 또는 protected source만 트리거.
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const now = new Date().toISOString();

  const { data: dueCapsules, error: fetchError } = await admin
    .from('capsules')
    .select('id, author_id, child_id, title, unlock_at')
    .eq('is_sealed', true)
    .eq('is_delivered', false)
    .lte('unlock_at', now);

  if (fetchError) {
    return Response.json({ error: fetchError.message }, { status: 500 });
  }

  if (!dueCapsules || dueCapsules.length === 0) {
    return Response.json({ delivered: 0 });
  }

  const ids = dueCapsules.map((c) => c.id);

  const { error: updateError } = await admin
    .from('capsules')
    .update({ is_delivered: true, delivered_at: now })
    .in('id', ids);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  // TODO: Expo Push 토큰 보관 테이블 도입 후 작성자에게 알림 발송
  // "[자녀]에게 [N]년 전 캡슐이 도착했습니다. 함께 열어보시겠어요?" (§8.4)

  return Response.json({ delivered: dueCapsules.length, ids });
});
