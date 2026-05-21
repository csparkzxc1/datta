import { supabase } from './supabase';

type SignedGetResponse = {
  url: string;
  expires_in: number;
};

/**
 * R2 signed GET URL을 발급받아 반환. §8.4 발송 후 미디어 표시, §10.1 영구 백업에 사용.
 */
export async function getMediaSignedUrl(mediaId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke<SignedGetResponse>('get-media-url', {
    body: { media_id: mediaId },
  });
  if (error || !data) throw new Error(error?.message ?? 'signed URL 발급 실패');
  return data.url;
}
