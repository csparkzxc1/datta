// 매일 00:00 KST cron으로 호출되어, 봉인된 채 unlock_at에 도달한 캡슐을
// is_delivered=true로 전환하고 작성자에게 Expo Push 알림을 보냄.
//
// CLAUDE.md §3.2, §8.4 — Supabase Edge Functions의 캡슐 봉인·발송 cron.
// §7.4 — "[자녀]에게 [N]년 전 캡슐이 도착했습니다. 함께 열어보시겠어요?"

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

type DueCapsule = {
  id: string;
  author_id: string;
  child_id: string;
  title: string | null;
  unlock_at: string;
};

type ChildRow = {
  id: string;
  name: string;
  birthdate: string;
};

type TokenRow = {
  user_id: string;
  expo_push_token: string;
};

type PushMessage = {
  to: string;
  sound: 'default';
  title: string;
  body: string;
  data: { capsule_id: string };
};

Deno.serve(async (req) => {
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

  const due = (dueCapsules ?? []) as DueCapsule[];
  if (due.length === 0) {
    return Response.json({ delivered: 0 });
  }

  const ids = due.map((c) => c.id);

  const { error: updateError } = await admin
    .from('capsules')
    .update({ is_delivered: true, delivered_at: now })
    .in('id', ids);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  // 작성자별 push 토큰 + 자녀 정보 조회
  const authorIds = [...new Set(due.map((c) => c.author_id))];
  const childIds = [...new Set(due.map((c) => c.child_id))];

  const [tokensRes, childrenRes] = await Promise.all([
    admin.from('push_tokens').select('user_id, expo_push_token').in('user_id', authorIds),
    admin.from('children').select('id, name, birthdate').in('id', childIds),
  ]);

  const tokens = (tokensRes.data ?? []) as TokenRow[];
  const children = (childrenRes.data ?? []) as ChildRow[];

  const tokensByUser = new Map<string, string[]>();
  tokens.forEach((t) => {
    const list = tokensByUser.get(t.user_id) ?? [];
    list.push(t.expo_push_token);
    tokensByUser.set(t.user_id, list);
  });
  const childById = new Map(children.map((c) => [c.id, c]));

  const messages: PushMessage[] = [];
  for (const capsule of due) {
    const userTokens = tokensByUser.get(capsule.author_id) ?? [];
    if (userTokens.length === 0) continue;

    const child = childById.get(capsule.child_id);
    const yearsAgo = child
      ? Math.max(0, new Date().getFullYear() - new Date(child.birthdate).getFullYear())
      : null;

    const title = '닿다';
    const childName = child?.name ?? '아이';
    const yearsLabel = yearsAgo && yearsAgo > 0 ? `${yearsAgo}년 전 ` : '';
    const body = `${childName}에게 ${yearsLabel}봉인했던 캡슐이 도착했어요. 함께 열어보시겠어요?`;

    for (const token of userTokens) {
      messages.push({
        to: token,
        sound: 'default',
        title,
        body,
        data: { capsule_id: capsule.id },
      });
    }
  }

  // Expo Push API는 batch 100건 이하 권장
  const chunks: PushMessage[][] = [];
  for (let i = 0; i < messages.length; i += 100) {
    chunks.push(messages.slice(i, i + 100));
  }

  const pushResults: unknown[] = [];
  for (const chunk of chunks) {
    try {
      const resp = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });
      pushResults.push(await resp.json());
    } catch (e) {
      pushResults.push({ error: e instanceof Error ? e.message : 'push fetch failed' });
    }
  }

  return Response.json({
    delivered: due.length,
    notified: messages.length,
    push_batches: pushResults.length,
    ids,
  });
});
