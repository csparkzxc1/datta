import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { supabase } from './supabase';

/**
 * §7.4 알림은 마일스톤·자녀 생일 등 부드러운 트리거에만 사용. 토큰 등록 자체는
 * 발송 인프라 준비. 사용자는 [나 → 알림 설정]에서 끌 수 있어야 함(§15).
 */
export async function registerPushTokenIfPermitted(): Promise<void> {
  if (!Device.isDevice) return; // 시뮬레이터/에뮬레이터 X

  // 이미 권한 있으면 즉시. 없으면 사용자가 명시적으로 요청한 경우에만 ask.
  const perm = (await Notifications.getPermissionsAsync()) as { granted: boolean };
  if (!perm.granted) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#E8927C',
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  let tokenResponse;
  try {
    tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
  } catch {
    return;
  }

  const token = tokenResponse.data;
  if (!token) return;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase.from('push_tokens').upsert(
    {
      user_id: userData.user.id,
      expo_push_token: token,
      platform: (Platform.OS as 'ios' | 'android' | 'web'),
      device_id: Device.osBuildId ?? null,
    },
    { onConflict: 'user_id,expo_push_token' }
  );
}

/**
 * 명시적으로 권한 요청. 알림 설정 화면의 toggle에서 호출.
 */
export async function requestPushPermissionAndRegister(): Promise<boolean> {
  const perm = (await Notifications.requestPermissionsAsync()) as { granted: boolean };
  if (!perm.granted) return false;
  await registerPushTokenIfPermitted();
  return true;
}
