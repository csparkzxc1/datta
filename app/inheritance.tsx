import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/auth-store';
import { useProfile, useUpdateInheritance } from '@/lib/queries/profile';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

export default function InheritanceScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { data: profile, isLoading } = useProfile();
  const updateInheritance = useUpdateInheritance();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    if (!profile) return;
    setName(profile.inheritance_contact_name ?? '');
    setEmail(profile.inheritance_contact_email ?? '');
    setPhone(profile.inheritance_contact_phone ?? '');
    setNote(profile.inheritance_contact_note ?? '');
  }, [profile]);

  if (!session) {
    router.replace('/onboarding/welcome');
    return null;
  }

  const hasAny = name || email || phone;
  const canSubmit = hasAny && !updateInheritance.isPending;

  const handleSave = async () => {
    setSubmitError(undefined);
    try {
      await updateInheritance.mutateAsync({
        inheritance_contact_name: name.trim() || null,
        inheritance_contact_email: email.trim() || null,
        inheritance_contact_phone: phone.trim() || null,
        inheritance_contact_note: note.trim() || null,
      });
      router.back();
    } catch {
      setSubmitError('잠시 멈췄어요. 다시 시도해보실까요');
    }
  };

  const handleClear = async () => {
    try {
      await updateInheritance.mutateAsync({
        inheritance_contact_name: null,
        inheritance_contact_email: null,
        inheritance_contact_phone: null,
        inheritance_contact_note: null,
      });
      setName('');
      setEmail('');
      setPhone('');
      setNote('');
    } catch {
      setSubmitError('잠시 멈췄어요. 다시 시도해보실까요');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '상속 관리자',
          headerBackTitle: '뒤로',
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.inkWarm,
          headerTitleStyle: {
            fontFamily: fonts.serif,
            fontSize: sizes.lg,
            color: colors.inkWarm,
          },
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.paper }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
            keyboardShouldPersistTaps="handled">
            <View style={{ gap: spacing.xs }}>
              <Text
                style={{ fontFamily: fonts.serif, fontSize: sizes['2xl'], color: colors.inkWarm }}>
                만약의 일이 일어나도
              </Text>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: sizes.base,
                  color: colors.inkSoft,
                  lineHeight: sizes.base * 1.7,
                }}>
                당신이 더 이상 닿다를 사용할 수 없게 되어도, 미리 지정해두신 분이
                봉인된 캡슐을 이어받을 수 있습니다. 자녀를 위한 마지막 보험입니다.
              </Text>
            </View>

            {isLoading ? (
              <ActivityIndicator color={colors.peach} />
            ) : (
              <>
                <Input
                  label="이름"
                  value={name}
                  onChangeText={setName}
                  placeholder="배우자 또는 신뢰하는 가족 1명"
                  maxLength={50}
                />
                <Input
                  label="이메일"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="they@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={120}
                />
                <Input
                  label="전화번호"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="010-0000-0000"
                  keyboardType="phone-pad"
                  maxLength={30}
                />
                <Input
                  label="이 분에게 남기는 한 줄 (선택)"
                  value={note}
                  onChangeText={setNote}
                  placeholder="이 분께 자녀의 캡슐을 부탁드립니다"
                  multiline
                  maxLength={500}
                />

                <Card style={{ backgroundColor: colors.peachSoft, borderColor: colors.peach }}>
                  <Text
                    style={{
                      fontFamily: fonts.body,
                      fontSize: sizes.sm,
                      color: colors.inkWarm,
                      lineHeight: sizes.sm * 1.7,
                    }}>
                    이 정보는 자녀 데이터처럼 가족 외 누구에게도 공유되지 않습니다. 어떤
                    분석에도 사용되지 않습니다.
                  </Text>
                </Card>

                {submitError ? (
                  <Text style={{ fontFamily: fonts.body, fontSize: sizes.sm, color: colors.error }}>
                    {submitError}
                  </Text>
                ) : null}

                <Button
                  label={updateInheritance.isPending ? '잠시만요…' : '저장하기'}
                  fullWidth
                  disabled={!canSubmit}
                  onPress={handleSave}
                />

                {hasAny ? (
                  <Button label="지정 해제하기" variant="tertiary" onPress={handleClear} />
                ) : null}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
