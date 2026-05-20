import * as ImageManipulator from 'expo-image-manipulator';

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

const MAX_LONG_EDGE = 2048;
const JPEG_QUALITY = 0.85;

/**
 * R2 업로드 전 단계로 큰 사진을 2048px 긴변·JPEG 85%로 리사이즈.
 * 캡슐당 5장, 저장 비용·발송 시 다운로드 시간 모두 절감.
 */
async function resizeIfNeeded(asset: UploadAsset): Promise<UploadAsset> {
  const longEdge = Math.max(asset.width, asset.height);
  if (longEdge === 0 || longEdge <= MAX_LONG_EDGE) {
    return asset;
  }

  const ratio = MAX_LONG_EDGE / longEdge;
  const targetWidth = Math.round(asset.width * ratio);
  const targetHeight = Math.round(asset.height * ratio);

  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: targetWidth, height: targetHeight } }],
    { compress: JPEG_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
  );

  return {
    uri: manipulated.uri,
    mimeType: 'image/jpeg',
    ext: 'jpg',
    width: manipulated.width ?? targetWidth,
    height: manipulated.height ?? targetHeight,
    sizeBytes: 0,
  };
}

/**
 * R2에 업로드한 뒤 capsule_media 행을 INSERT.
 * RLS상 미봉인 캡슐의 미디어만 INSERT 가능(§7.2).
 */
export async function uploadCapsuleMedia(
  capsuleId: string,
  rawAsset: UploadAsset,
  orderIndex: number
): Promise<void> {
  const asset = await resizeIfNeeded(rawAsset);

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
    size_bytes: asset.sizeBytes || blob.size,
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
