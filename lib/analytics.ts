// CLAUDE.md §7.3, §12.3 — 자녀 콘텐츠는 어떤 이벤트로도 외부에 전송되지 않습니다.
// 이 모듈은 그 약속을 *컴파일 타임 + 런타임*으로 강제합니다.

type AnalyticsEvent =
  | { name: 'app_open' }
  | { name: 'login_success' }
  | { name: 'signup_success' }
  | { name: 'onboarding_completed' }
  | { name: 'child_added' }
  | { name: 'capsule_started'; props?: { milestone_key?: string } }
  | { name: 'capsule_sealed'; props?: { has_photos?: boolean; photo_count?: number; milestone_key?: string } }
  | { name: 'capsule_delivered_viewed' }
  | { name: 'export_pdf_clicked' }
  | { name: 'export_zip_clicked'; props?: { with_media?: boolean } }
  | { name: 'upgrade_clicked'; props?: { trigger?: string } }
  | { name: 'notifications_enabled' }
  | { name: 'notifications_disabled' }
  | { name: 'inheritance_set' }
  | { name: 'inheritance_cleared' };

const FORBIDDEN_PROP_KEYS = new Set([
  'name',
  'child_name',
  'body',
  'title',
  'email',
  'phone',
  'birthdate',
  'note',
]);

type MixpanelLike = {
  init: () => Promise<void>;
  track: (event: string, props?: Record<string, unknown>) => void;
  identify: (userId: string) => void;
  reset: () => void;
};

let mixpanel: MixpanelLike | null = null;
let initPromise: Promise<void> | null = null;

export async function initAnalytics(): Promise<void> {
  if (initPromise) return initPromise;
  const token = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;

  initPromise = (async () => {
    try {
      const mod = (await import('mixpanel-react-native')) as unknown as {
        Mixpanel: new (token: string, trackAutomaticEvents: boolean) => MixpanelLike;
      };
      const instance = new mod.Mixpanel(token, false);
      await instance.init();
      mixpanel = instance;
    } catch (e) {
      console.warn('[analytics] init failed', e);
    }
  })();

  return initPromise;
}

function sanitizeProps(props: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!props) return {};
  const safe: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (FORBIDDEN_PROP_KEYS.has(k.toLowerCase())) {
      console.warn(`[analytics] forbidden prop dropped: ${k}`);
      continue;
    }
    if (typeof v === 'string' && v.length > 80) {
      console.warn(`[analytics] long string dropped (suspected content): ${k}`);
      continue;
    }
    safe[k] = v;
  }
  return safe;
}

export function track(event: AnalyticsEvent): void {
  if (!mixpanel) return;
  const props = 'props' in event ? sanitizeProps(event.props as Record<string, unknown>) : {};
  mixpanel.track(event.name, props);
}

export function identifyUser(userId: string): void {
  if (!mixpanel) return;
  mixpanel.identify(userId);
}

export function resetAnalytics(): void {
  if (!mixpanel) return;
  mixpanel.reset();
}
