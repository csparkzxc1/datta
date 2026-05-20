import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { SealAnimation } from '@/components/brand/seal-animation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MilestoneCard } from '@/components/ui/milestone-card';
import {
  formatAgeAtThen,
  resolveMilestones,
  type MilestoneKey,
} from '@/lib/milestones';
import {
  useCreateCapsule,
  useSealCapsule,
  useUpdateCapsule,
} from '@/lib/queries/capsules';
import { useChildren, type Child } from '@/lib/queries/children';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type Step = 1 | 2 | 3 | 4;

const AUTOSAVE_DELAY_MS = 3000;
const SEAL_HOLD_MS = 1000;

export default function NewCapsuleScreen() {
  const router = useRouter();
  const { data: children, isLoading: childrenLoading } = useChildren();
  const createCapsule = useCreateCapsule();
  const updateCapsule = useUpdateCapsule();
  const sealCapsule = useSealCapsule();

  const [step, setStep] = useState<Step>(1);
  const [childId, setChildId] = useState<string>('');
  const [milestoneKey, setMilestoneKey] = useState<MilestoneKey | null>(null);
  const [unlockDate, setUnlockDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [showSealAnim, setShowSealAnim] = useState(false);

  const selectedChild: Child | undefined = useMemo(
    () => children?.find((c) => c.id === childId),
    [children, childId]
  );

  useEffect(() => {
    if (children?.length === 1 && !childId) {
      setChildId(children[0].id);
    }
  }, [children, childId]);

  const goNext = async () => {
    if (step === 1 && childId) {
      setStep(2);
    } else if (step === 2 && unlockDate) {
      await ensureDraftCreated();
      setStep(3);
    } else if (step === 3 && body.trim().length > 0) {
      await flushDraft();
      setStep(4);
    }
  };

  const ensureDraftCreated = async () => {
    if (draftId || !unlockDate || !childId) return;
    try {
      const draft = await createCapsule.mutateAsync({
        child_id: childId,
        unlock_at: unlockDate.toISOString(),
        milestone_key: milestoneKey,
        body: '',
        title: null,
      });
      setDraftId(draft.id);
    } catch {
      // 네트워크 실패 — Step 3에서 자동저장 시 재시도
    }
  };

  const flushDraft = async () => {
    if (!draftId) return;
    try {
      await updateCapsule.mutateAsync({
        id: draftId,
        input: { title: title.trim() || null, body },
      });
    } catch {
      // 자동저장 실패 — 다음 변경에 재시도
    }
  };

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (step !== 3 || !draftId) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      void flushDraft();
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, title, step, draftId]);

  const handleSeal = async () => {
    if (!draftId) return;
    try {
      await flushDraft();
      await sealCapsule.mutateAsync(draftId);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSealAnim(true);
    } catch {
      // 봉인 실패 — 화면에 유지, 사용자가 재시도
    }
  };

  if (showSealAnim) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SealAnimation onDone={() => router.replace('/(tabs)')} />
      </>
    );
  }

  if (childrenLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.peach} />
      </View>
    );
  }

  if (!children || children.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: '새 캡슐' }} />
        <View style={{ flex: 1, padding: spacing.lg, backgroundColor: colors.paper }}>
          <Card>
            <View style={{ gap: spacing.md, alignItems: 'flex-start' }}>
              <Text
                style={{
                  fontFamily: fonts.serif,
                  fontSize: sizes.lg,
                  color: colors.inkWarm,
                }}>
                먼저 자녀를 등록해주세요
              </Text>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.base,
                  color: colors.inkSoft,
                  lineHeight: sizes.base * 1.7,
                }}>
                캡슐은 누구에게 닿을지부터 정합니다.
              </Text>
              <Button label="자녀 등록하기" onPress={() => router.replace('/child/new')} />
            </View>
          </Card>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: '새 캡슐', headerBackTitle: '뒤로' }} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.paper }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing['3xl'] }}
          keyboardShouldPersistTaps="handled">
          <StepIndicator step={step} />

          {step === 1 && (
            <Step1Child items={children} value={childId} onChange={setChildId} />
          )}

          {step === 2 && selectedChild && (
            <Step2When
              child={selectedChild}
              milestoneKey={milestoneKey}
              unlockDate={unlockDate}
              onPickMilestone={(key, date) => {
                setMilestoneKey(key);
                setUnlockDate(date);
              }}
              onPickCustom={(date) => {
                setMilestoneKey(null);
                setUnlockDate(date);
              }}
              showAndroidPicker={showAndroidPicker}
              setShowAndroidPicker={setShowAndroidPicker}
            />
          )}

          {step === 3 && (
            <Step3Body
              title={title}
              body={body}
              onTitleChange={setTitle}
              onBodyChange={setBody}
              autoSaving={updateCapsule.isPending}
            />
          )}

          {step === 4 && selectedChild && unlockDate && (
            <Step4Confirm
              child={selectedChild}
              unlockDate={unlockDate}
              title={title}
              body={body}
            />
          )}

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {step > 1 && (
              <Button
                label="이전"
                variant="secondary"
                onPress={() => setStep((s) => (Math.max(1, s - 1) as Step))}
              />
            )}
            {step < 4 ? (
              <Button
                label={step === 3 ? '다음 — 봉인 확인' : '다음'}
                fullWidth
                onPress={goNext}
                disabled={!canProceed(step, { childId, unlockDate, body })}
              />
            ) : (
              <SealButton onSeal={handleSeal} busy={sealCapsule.isPending} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function canProceed(
  step: Step,
  state: { childId: string; unlockDate: Date | null; body: string }
): boolean {
  if (step === 1) return state.childId.length > 0;
  if (step === 2) return state.unlockDate !== null;
  if (step === 3) return state.body.trim().length > 0;
  return true;
}

function StepIndicator({ step }: { step: Step }) {
  const labels = ['자녀', '시점', '본문', '봉인'];
  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs }}>
      {labels.map((label, i) => {
        const idx = (i + 1) as Step;
        const active = step === idx;
        const past = step > idx;
        return (
          <View key={label} style={{ flex: 1, gap: 4 }}>
            <View
              style={{
                height: 2,
                backgroundColor: active || past ? colors.peach : `${colors.inkSoft}33`,
                borderRadius: 1,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.xs,
                color: active ? colors.peach : colors.inkSoft,
                textAlign: 'center',
              }}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function Step1Child({
  items,
  value,
  onChange,
}: {
  items: Child[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <View style={{ gap: spacing.md }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: sizes.xl, color: colors.inkWarm }}>
        누구에게 닿을까요?
      </Text>
      <View style={{ gap: spacing.sm }}>
        {items.map((child) => {
          const selected = value === child.id;
          return (
            <Card
              key={child.id}
              selected={selected}
              onPress={() => onChange(child.id)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}>
                <Text style={{ fontFamily: fonts.hand, fontSize: sizes.xl, color: colors.inkWarm }}>
                  {child.name}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.english,
                    fontSize: sizes.sm,
                    color: colors.inkSoft,
                  }}>
                  {child.birthdate}
                </Text>
              </View>
            </Card>
          );
        })}
      </View>
    </View>
  );
}

function Step2When({
  child,
  milestoneKey,
  unlockDate,
  onPickMilestone,
  onPickCustom,
  showAndroidPicker,
  setShowAndroidPicker,
}: {
  child: Child;
  milestoneKey: MilestoneKey | null;
  unlockDate: Date | null;
  onPickMilestone: (key: MilestoneKey, date: Date) => void;
  onPickCustom: (date: Date) => void;
  showAndroidPicker: boolean;
  setShowAndroidPicker: (v: boolean) => void;
}) {
  const birthdate = new Date(child.birthdate);
  const resolved = resolveMilestones(birthdate, {
    gender: child.gender ?? undefined,
  }).filter((r) => r.date && !r.passed);

  const isCustom = !milestoneKey && unlockDate !== null;

  return (
    <View style={{ gap: spacing.md }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: sizes.xl, color: colors.inkWarm }}>
        언제 닿게 할까요?
      </Text>

      <View style={{ gap: spacing.sm }}>
        {resolved.map((r) =>
          r.date ? (
            <MilestoneCard
              key={r.milestone.key}
              name={r.milestone.nameKr}
              date={r.date}
              ageAtThen={formatAgeAtThen(birthdate, r.date)}
              selected={milestoneKey === r.milestone.key}
              onPress={() => onPickMilestone(r.milestone.key, r.date!)}
            />
          ) : null
        )}
      </View>

      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: sizes.sm,
          color: colors.inkSoft,
          marginTop: spacing.md,
        }}>
        원하는 날짜 직접 정하기
      </Text>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={isCustom && unlockDate ? unlockDate : addMonths(new Date(), 6)}
          mode="date"
          display="compact"
          minimumDate={new Date()}
          onChange={(_, d) => d && onPickCustom(d)}
          themeVariant="light"
          locale="ko-KR"
        />
      ) : (
        <>
          <Pressable
            onPress={() => setShowAndroidPicker(true)}
            style={{
              paddingVertical: spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: colors.inkSoft,
            }}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.base,
                color: colors.inkWarm,
              }}>
              {isCustom && unlockDate ? formatHumanDate(unlockDate) : '날짜 선택'}
            </Text>
          </Pressable>
          {showAndroidPicker && (
            <DateTimePicker
              value={isCustom && unlockDate ? unlockDate : addMonths(new Date(), 6)}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(_, d) => {
                setShowAndroidPicker(false);
                if (d) onPickCustom(d);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}

function Step3Body({
  title,
  body,
  onTitleChange,
  onBodyChange,
  autoSaving,
}: {
  title: string;
  body: string;
  onTitleChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  autoSaving: boolean;
}) {
  return (
    <View style={{ gap: spacing.md }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}>
        <Text style={{ fontFamily: fonts.serif, fontSize: sizes.xl, color: colors.inkWarm }}>
          마음을 적어주세요
        </Text>
        {autoSaving ? (
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.xs,
              color: colors.inkSoft,
            }}>
            저장 중…
          </Text>
        ) : null}
      </View>
      <Input
        label="제목 (선택)"
        value={title}
        onChangeText={onTitleChange}
        placeholder="짧은 한 줄"
        maxLength={80}
      />
      <Input
        label="본문"
        value={body}
        onChangeText={onBodyChange}
        placeholder="지금 떠오르는 한 마디"
        multiline
        maxLength={5000}
      />
      <Text style={{ fontFamily: fonts.body, fontSize: sizes.xs, color: colors.inkSoft }}>
        {body.length.toLocaleString()} / 5,000자
      </Text>
    </View>
  );
}

function Step4Confirm({
  child,
  unlockDate,
  title,
  body,
}: {
  child: Child;
  unlockDate: Date;
  title: string;
  body: string;
}) {
  const birthdate = new Date(child.birthdate);
  const ageAtThen = formatAgeAtThen(birthdate, unlockDate);
  const preview = body.length > 60 ? body.slice(0, 60) + '…' : body;

  return (
    <View style={{ gap: spacing.lg }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: sizes.xl, color: colors.inkWarm }}>
        잠깐, 신중히 생각해보세요
      </Text>

      <Card>
        <View style={{ gap: spacing.sm }}>
          <Row label="받을 사람" value={`${child.name} (${ageAtThen})`} />
          <Row label="닿을 시점" value={formatHumanDate(unlockDate)} />
          {title ? <Row label="제목" value={title} /> : null}
          <Row label="본문" value={preview} />
        </View>
      </Card>

      <Card style={{ backgroundColor: colors.peachSoft, borderColor: colors.peach }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ fontFamily: fonts.serif, fontSize: sizes.lg, color: colors.inkWarm }}>
            봉인 후에는 수정·삭제할 수 없습니다
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.sm,
              color: colors.inkWarm,
              lineHeight: sizes.sm * 1.7,
            }}>
            한 번 보낸 편지는 회수할 수 없는 것과 같습니다. 그게 약속의 무게입니다.
          </Text>
        </View>
      </Card>
    </View>
  );
}

function SealButton({ onSeal, busy }: { onSeal: () => void; busy: boolean }) {
  return (
    <Pressable
      onLongPress={onSeal}
      delayLongPress={SEAL_HOLD_MS}
      disabled={busy}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.peach,
        borderRadius: 4,
        paddingVertical: 14,
        alignItems: 'center',
        opacity: busy ? 0.45 : pressed ? 0.7 : 1,
      })}>
      <Text style={{ fontFamily: fonts.body, fontSize: sizes.base, color: colors.paper }}>
        {busy ? '봉인 중…' : '길게 눌러 봉인'}
      </Text>
    </Pressable>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md }}>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: sizes.sm,
          color: colors.inkSoft,
          width: 64,
        }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: sizes.base,
          color: colors.inkWarm,
          flex: 1,
          lineHeight: sizes.base * 1.6,
        }}>
        {value}
      </Text>
    </View>
  );
}

function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

function formatHumanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
