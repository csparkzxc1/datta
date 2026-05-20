import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';

import { getMediaSignedUrl } from './media-url';
import { type CapsuleMedia } from './queries/capsule-media';
import { type Capsule } from './queries/capsules';
import { type Child } from './queries/children';
import { supabase } from './supabase';

type ExportData = {
  children: Child[];
  capsules: Capsule[];
  mediaByCapsule: Record<string, CapsuleMedia[]>;
  exportedAt: Date;
};

async function fetchAllForExport(): Promise<ExportData> {
  const [childrenRes, capsulesRes, mediaRes] = await Promise.all([
    supabase.from('children').select('*'),
    supabase.from('capsules').select('*').order('unlock_at', { ascending: true }),
    supabase.from('capsule_media').select('*'),
  ]);
  if (childrenRes.error) throw childrenRes.error;
  if (capsulesRes.error) throw capsulesRes.error;
  if (mediaRes.error) throw mediaRes.error;

  const mediaByCapsule: Record<string, CapsuleMedia[]> = {};
  ((mediaRes.data ?? []) as CapsuleMedia[]).forEach((m) => {
    if (!mediaByCapsule[m.capsule_id]) mediaByCapsule[m.capsule_id] = [];
    mediaByCapsule[m.capsule_id].push(m);
  });

  return {
    children: (childrenRes.data ?? []) as Child[],
    capsules: (capsulesRes.data ?? []) as Capsule[],
    mediaByCapsule,
    exportedAt: new Date(),
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatYmd(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function formatHumanDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function buildPdfHtml(data: ExportData): string {
  const exportedAtStr = `${data.exportedAt.getFullYear()}년 ${
    data.exportedAt.getMonth() + 1
  }월 ${data.exportedAt.getDate()}일`;

  const childById = new Map(data.children.map((c) => [c.id, c]));

  const childrenHtml = data.children
    .map(
      (c) => `
      <li>
        <span class="hand">${escapeHtml(c.name)}</span>
        <span class="meta">· ${escapeHtml(c.birthdate)}</span>
      </li>`
    )
    .join('');

  const capsulesHtml = data.capsules
    .map((c) => {
      const child = childById.get(c.child_id);
      const media = data.mediaByCapsule[c.id] ?? [];
      return `
        <article class="capsule">
          <h3>${escapeHtml(c.title?.trim() || (c.is_sealed ? '봉인된 캡슐' : '작성 중인 캡슐'))}</h3>
          <div class="meta-row">
            <span class="label">받을 사람</span>
            <span>${escapeHtml(child?.name ?? '?')}</span>
          </div>
          <div class="meta-row">
            <span class="label">닿을 시점</span>
            <span>${formatHumanDate(c.unlock_at)}</span>
          </div>
          <div class="meta-row">
            <span class="label">상태</span>
            <span>${c.is_delivered ? '도착함' : c.is_sealed ? '봉인됨' : '작성 중'}</span>
          </div>
          ${c.sealed_at ? `<div class="meta-row"><span class="label">봉인 일시</span><span>${formatHumanDate(c.sealed_at)}</span></div>` : ''}
          <pre class="body">${escapeHtml(c.body)}</pre>
          ${media.length > 0 ? `<p class="meta">사진 ${media.length}장 — 원본은 ZIP 백업에 포함됩니다</p>` : ''}
        </article>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<style>
  @page { margin: 24mm 20mm; }
  body {
    font-family: 'Noto Serif KR', 'AppleSDGothicNeo', serif;
    color: #2B1F19;
    line-height: 1.7;
    font-size: 12pt;
  }
  h1 { font-size: 28pt; font-weight: 500; margin: 0 0 8pt; }
  h2 { font-size: 18pt; font-weight: 500; margin: 32pt 0 12pt; border-bottom: 0.5pt solid #5C4F45; padding-bottom: 4pt; }
  h3 { font-size: 14pt; font-weight: 500; margin: 0 0 8pt; }
  .sub { color: #5C4F45; font-size: 10pt; font-style: italic; }
  .promise {
    background: #F4D5C9;
    border-left: 4pt solid #E8927C;
    padding: 12pt 16pt;
    margin: 16pt 0 24pt;
    font-size: 11pt;
  }
  .hand { font-weight: 500; }
  .meta { color: #5C4F45; font-size: 10pt; }
  ul { padding-left: 18pt; }
  li { margin-bottom: 4pt; }
  .capsule {
    margin: 16pt 0;
    padding: 12pt 16pt;
    border: 0.5pt solid #5C4F45;
    border-radius: 4pt;
    page-break-inside: avoid;
  }
  .meta-row {
    display: flex;
    gap: 12pt;
    font-size: 10pt;
    margin-bottom: 4pt;
  }
  .meta-row .label { color: #5C4F45; min-width: 60pt; }
  pre.body {
    font-family: inherit;
    white-space: pre-wrap;
    word-break: keep-all;
    margin: 12pt 0 0;
    font-size: 12pt;
    line-height: 1.8;
  }
</style>
</head>
<body>
  <h1>닿다 — 영구 백업</h1>
  <p class="sub">${exportedAtStr} 내보냄</p>
  <div class="promise">
    이 백업은 §10.1 신뢰 약속에 따라 언제든 무료로 만들어집니다. 회사가 사라져도, 앱을 더는 쓰지 않게 되어도, 이 파일 하나로 모든 캡슐과 자녀 정보가 보존됩니다.
  </div>

  <h2>자녀 (${data.children.length}명)</h2>
  <ul>${childrenHtml || '<li>등록된 자녀가 없습니다.</li>'}</ul>

  <h2>캡슐 (${data.capsules.length}개)</h2>
  ${capsulesHtml || '<p class="meta">아직 캡슐이 없습니다.</p>'}
</body>
</html>`;
}

export async function exportToPdf(): Promise<void> {
  const data = await fetchAllForExport();
  const html = buildPdfHtml(data);
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: '닿다 PDF 백업',
      UTI: 'com.adobe.pdf',
    });
  }
}

export type ZipExportOptions = {
  includeMedia?: boolean;
  onProgress?: (uploaded: number, total: number) => void;
};

export async function exportToZip(options: ZipExportOptions = {}): Promise<void> {
  const data = await fetchAllForExport();
  const zip = new JSZip();

  zip.file(
    'manifest.json',
    JSON.stringify(
      {
        app: 'datta',
        version: 1,
        exported_at: data.exportedAt.toISOString(),
        children_count: data.children.length,
        capsules_count: data.capsules.length,
        sealed_count: data.capsules.filter((c) => c.is_sealed).length,
        delivered_count: data.capsules.filter((c) => c.is_delivered).length,
      },
      null,
      2
    )
  );
  zip.file('children.json', JSON.stringify(data.children, null, 2));
  zip.file('capsules.json', JSON.stringify(data.capsules, null, 2));
  zip.file('capsule_media.json', JSON.stringify(data.mediaByCapsule, null, 2));

  const childById = new Map(data.children.map((c) => [c.id, c]));
  for (const c of data.capsules) {
    const child = childById.get(c.child_id);
    const txt = `제목: ${c.title ?? ''}
받을 사람: ${child?.name ?? '?'} (생일 ${child?.birthdate ?? '?'})
닿을 시점: ${formatHumanDate(c.unlock_at)}
상태: ${c.is_delivered ? '도착함' : c.is_sealed ? '봉인됨' : '작성 중'}
${c.sealed_at ? `봉인 일시: ${formatHumanDate(c.sealed_at)}\n` : ''}${c.delivered_at ? `도착 일시: ${formatHumanDate(c.delivered_at)}\n` : ''}
─────────────────────
${c.body}
`;
    zip.file(`capsules/${c.id}.txt`, txt);
  }

  if (options.includeMedia) {
    const allMedia = Object.values(data.mediaByCapsule).flat();
    const total = allMedia.length;
    let done = 0;
    options.onProgress?.(done, total);
    for (const m of allMedia) {
      try {
        const url = await getMediaSignedUrl(m.id);
        const resp = await fetch(url);
        const buf = await resp.arrayBuffer();
        const ext = m.mime_type.split('/')[1] ?? 'bin';
        zip.file(`media/${m.capsule_id}/${m.id}.${ext}`, new Uint8Array(buf));
      } catch {
        // skip 실패한 미디어 — 메타데이터(capsule_media.json)에는 남아있음
      }
      done += 1;
      options.onProgress?.(done, total);
    }
  }

  zip.file(
    'README.txt',
    `닿다 — 영구 백업
${data.exportedAt.toISOString()}

이 파일은 CLAUDE.md §10.1 신뢰 약속에 따라 언제든 무료로 만들어집니다.
회사가 사라져도 이 백업으로 모든 자녀·캡슐 데이터가 보존됩니다.

구조:
- manifest.json       백업 메타정보
- children.json       자녀 데이터 (JSON)
- capsules.json       캡슐 메타데이터 (JSON)
- capsule_media.json  미디어 메타데이터 (JSON)
- capsules/<id>.txt   캡슐별 본문 + 메타 (사람이 읽기 좋게)
${options.includeMedia ? '- media/<capsule_id>/<media_id>.<ext>  원본 사진' : '- 사진 원본은 [사진 포함] 옵션으로 다시 받으세요'}
`
  );

  const base64 = await zip.generateAsync({ type: 'base64' });
  const path = `${FileSystem.documentDirectory}datta-backup-${formatYmd(data.exportedAt)}.zip`;
  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, {
      mimeType: 'application/zip',
      dialogTitle: '닿다 ZIP 백업',
      UTI: 'public.zip-archive',
    });
  }
}
