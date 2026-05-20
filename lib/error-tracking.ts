// CLAUDE.md §3.1 — Sentry는 스택트레이스만, 사용자 콘텐츠 마스킹.

const MASK_KEYS = new Set([
  'body',
  'title',
  'name',
  'child_name',
  'email',
  'phone',
  'birthdate',
  'note',
  'password',
]);

let initialized = false;

export async function initErrorTracking(): Promise<void> {
  if (initialized) return;
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  try {
    const Sentry = await import('@sentry/react-native');
    Sentry.init({
      dsn,
      enableAutoSessionTracking: true,
      tracesSampleRate: 0.1,
      beforeSend(event) {
        if (event.extra) {
          for (const key of Object.keys(event.extra)) {
            if (MASK_KEYS.has(key.toLowerCase())) {
              event.extra[key] = '[masked]';
            }
          }
        }
        if (event.user) {
          // 이메일·이름은 마스킹, id만 유지
          delete event.user.email;
          delete event.user.username;
        }
        if (event.request?.data) {
          event.request.data = '[masked]';
        }
        return event;
      },
      beforeBreadcrumb(b) {
        if (b.data) {
          for (const key of Object.keys(b.data)) {
            if (MASK_KEYS.has(key.toLowerCase())) {
              b.data[key] = '[masked]';
            }
          }
        }
        return b;
      },
    });
    initialized = true;
  } catch (e) {
    console.warn('[sentry] init failed', e);
  }
}
