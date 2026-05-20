import { supabase } from './supabase';

export type UploadAsset = {
  uri: string;
  mimeType: string;
  ext: string;
  width: number;
  height: number;
  sizeBytes: number;
};

type UploadUrlResponse = {
  url: string;
  key: string;
  expires_in: number;
};

/**
 * R2에 업로드한 뒤 capsule_media 행을 INSERT.
 * RLS상 미봉인 캡슐의 미디어만 INSERT 가능(§7.2).
 */
export async function uploadCapsuleMedia(
  capsuleId: string,
  asset: UploadAsset,
  orderIndex: number
): Promise<void> {
  const { data: signedData, error: signedError } = await supabase.functions.invoke<
    UploadUrlResponse
  >('get-upload-url', {
    body: {
      capsule_id: capsuleId,
      content_type: asset.mimeType,
      ext: asset.ext,
    },
  });

  if (signedError || !signedData) {
    throw new Error(signedError?.message ?? 'signed URL 발급 실패');
  }

  const fileResponse = await fetch(asset.uri);
  const blob = await fileResponse.blob();

  const putResponse = await fetch(signedData.url, {
    method: 'PUT',
    body: blob,
    headers: { 'content-type': asset.mimeType },
  });

  if (!putResponse.ok) {
    throw new Error(`R2 업로드 실패: ${putResponse.status}`);
  }

  const { error: insertError } = await supabase.from('capsule_media').insert({
    capsule_id: capsuleId,
    kind: 'photo',
    storage_provider: 'r2',
    storage_key: signedData.key,
    size_bytes: asset.sizeBytes,
    mime_type: asset.mimeType,
    width: asset.width,
    height: asset.height,
    order_index: orderIndex,
  });

  if (insertError) throw insertError;
}

export function extractExt(uri: string, fallback = 'jpg'): string {
  const match = uri.toLowerCase().match(/\.([a-z0-9]+)(?:\?|$)/);
  if (!match) return fallback;
  const raw = match[1];
  return raw.replace(/[^a-z0-9]/g, '').slice(0, 5) || fallback;
}
