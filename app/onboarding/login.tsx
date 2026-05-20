import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { track } from '@/lib/analytics';
import { useAuthStore } from '@/lib/auth-store';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

type Mode = 'signin' | 'signup';

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signInWithEmail);
  const signUp = useAuthStore((s) => s.signUpWithEmail);

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    setBusy(true);
    setError(undefined);

    const result =
      mode === 'signin'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, name.trim() || '익명');

    setBusy(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    track({ name: mode === 'signin' ? 'login_success' : 'signup_success' });
    router.replace('/(tabs)');
  };

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    (mode === 'signin' || name.trim().length > 0) &&
    !busy;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingTop: spacing.xl,
            gap: spacing.lg,
          }}
          keyboardShouldPersistTaps="handled">
          <View style={{ gap: spacing.xs }}>
            <Text
              style={{
                fontFamily: fonts.serif,
                fontSize: sizes['2xl'],
                color: colors.inkWarm,
              }}>
              {mode === 'signin' ? '다시 들어오시겠어요' : '닿다를 시작합니다'}
            </Text>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: colors.inkSoft,
              }}>
              {mode === 'signin'
                ? '봉인된 캡슐은 그대로 기다리고 있어요.'
                : '오늘의 한 줄이, 그날의 평생이 됩니다.'}
            </Text>
          </View>

          <View style={{ gap: spacing.md }}>
            {mode === 'signup' && (
              <Input
                label="이름"
                value={name}
                onChangeText={setName}
                placeholder="자녀가 부르는 이름이면 좋아요"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
            <Input
              label="이메일"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="비밀번호"
              value={password}
              onChangeText={setPassword}
              placeholder="6자 이상"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              error={error}
            />
          </View>

          <Button
            label={busy ? '잠시만요…' : mode === 'signin' ? '로그인' : '가입하기'}
            fullWidth
            disabled={!canSubmit}
            onPress={handleSubmit}
          />

          <Button
            label={
              mode === 'signin' ? '처음이신가요? 가입하기' : '이미 가입하셨나요? 로그인'
            }
            variant="tertiary"
            fullWidth
            onPress={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(undefined);
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
