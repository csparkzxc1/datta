import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Choice } from '@/components/ui/choice';
import { Input } from '@/components/ui/input';
import { useAddChild, type Gender, type Relationship } from '@/lib/queries/children';
import { colors, fonts, sizes, spacing } from '@/theme/tokens';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: '여' },
  { value: 'male', label: '남' },
  { value: 'other', label: '기타' },
];

const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: 'parent', label: '엄마/아빠' },
  { value: 'grandparent', label: '조부모' },
  { value: 'guardian', label: '기타' },
];

export default function NewChildScreen() {
  const router = useRouter();
  const addChild = useAddChild();

  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState<Date>(new Date());
  const [gender, setGender] = useState<Gender | null>(null);
  const [relationship, setRelationship] = useState<Relationship>('parent');
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const canSubmit = name.trim().length > 0 && !addChild.isPending;

  const handleSubmit = async () => {
    setSubmitError(undefined);
    try {
      await addChild.mutateAsync({
        name: name.trim(),
        birthdate: toIsoDate(birthdate),
        gender,
        relationship,
      });
      router.back();
    } catch (e) {
      setSubmitError(
        e instanceof Error ? '잠시 멈췄어요. 다시 시도해보실까요' : '잠시 멈췄어요'
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: '자녀 등록', headerBackTitle: '뒤로' }} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.paper }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}
          keyboardShouldPersistTaps="handled">
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: sizes.sm,
              color: colors.inkSoft,
              lineHeight: sizes.sm * 1.7,
            }}>
            자녀의 정보는 가족 외 누구도 보지 못합니다. 분석에도 사용되지 않아요.
          </Text>

          <Input
            label="이름"
            value={name}
            onChangeText={setName}
            placeholder="자녀의 이름"
            maxLength={30}
          />

          <View style={{ gap: spacing.sm }}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: colors.inkSoft,
              }}>
              생일
            </Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(_, d) => d && setBirthdate(d)}
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
                    {formatBirthdate(birthdate)}
                  </Text>
                </Pressable>
                {showAndroidPicker && (
                  <DateTimePicker
                    value={birthdate}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(_, d) => {
                      setShowAndroidPicker(false);
                      if (d) setBirthdate(d);
                    }}
                  />
                )}
              </>
            )}
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: colors.inkSoft,
              }}>
              성별
            </Text>
            <Choice value={gender} options={GENDER_OPTIONS} onChange={setGender} />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.xs,
                color: colors.inkSoft,
              }}>
              군 입대 같은 마일스톤 노출에만 사용됩니다.
            </Text>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: colors.inkSoft,
              }}>
              관계
            </Text>
            <Choice
              value={relationship}
              options={RELATIONSHIP_OPTIONS}
              onChange={setRelationship}
            />
          </View>

          {submitError ? (
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.sm,
                color: colors.error,
              }}>
              {submitError}
            </Text>
          ) : null}

          <Button
            label={addChild.isPending ? '잠시만요…' : '등록하기'}
            fullWidth
            disabled={!canSubmit}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatBirthdate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
