import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/button';
import { Choice } from '@/components/ui/choice';
import { Input } from '@/components/ui/input';
import {
  useChildren,
  useUpdateChild,
  type Gender,
  type Relationship,
} from '@/lib/queries/children';
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

export default function EditChildScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: children, isLoading } = useChildren();
  const updateChild = useUpdateChild();

  const child = children?.find((c) => c.id === id);

  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState<Date>(new Date());
  const [gender, setGender] = useState<Gender | null>(null);
  const [relationship, setRelationship] = useState<Relationship>('parent');
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    if (!child) return;
    setName(child.name);
    setBirthdate(new Date(child.birthdate));
    setGender(child.gender);
    setRelationship(child.relationship);
  }, [child]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.paper }}>
        <ActivityIndicator color={colors.peach} />
      </View>
    );
  }

  if (!child) {
    return (
      <View style={{ flex: 1, padding: spacing.lg, backgroundColor: colors.paper }}>
        <Text style={{ fontFamily: fonts.body, fontSize: sizes.base, color: colors.inkSoft }}>
          자녀를 찾을 수 없어요.
        </Text>
      </View>
    );
  }

  const canSubmit = name.trim().length > 0 && !updateChild.isPending;

  const handleSubmit = async () => {
    setSubmitError(undefined);
    try {
      await updateChild.mutateAsync({
        id: child.id,
        input: {
          name: name.trim(),
          birthdate: toIsoDate(birthdate),
          gender,
          relationship,
        },
      });
      router.back();
    } catch {
      setSubmitError('잠시 멈췄어요. 다시 시도해보실까요');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: '자녀 수정', headerBackTitle: '뒤로' }} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.paper }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}
          keyboardShouldPersistTaps="handled">
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
                    {formatHumanDate(birthdate)}
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
            <Text style={{ fontFamily: fonts.body, fontSize: sizes.sm, color: colors.inkSoft }}>
              성별
            </Text>
            <Choice value={gender} options={GENDER_OPTIONS} onChange={setGender} />
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontFamily: fonts.body, fontSize: sizes.sm, color: colors.inkSoft }}>
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
              style={{ fontFamily: fonts.body, fontSize: sizes.sm, color: colors.error }}>
              {submitError}
            </Text>
          ) : null}

          <Button
            label={updateChild.isPending ? '잠시만요…' : '저장하기'}
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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function formatHumanDate(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
