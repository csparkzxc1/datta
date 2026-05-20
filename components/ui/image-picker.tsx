import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Alert, Pressable, Text, View } from 'react-native';
import { colors, fonts, radii, sizes, spacing } from '@/theme/tokens';

type ImagePickerInputProps = {
  values: string[];
  onChange: (uris: string[]) => void;
  maxCount?: number;
};

const DEFAULT_MAX = 5;
const THUMB_SIZE = 72;

export function ImagePickerInput({
  values,
  onChange,
  maxCount = DEFAULT_MAX,
}: ImagePickerInputProps) {
  const canAddMore = values.length < maxCount;

  const handleAdd = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('사진 접근 권한이 필요해요', '설정에서 사진 권한을 허용해주세요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: maxCount - values.length,
      quality: 0.9,
    });

    if (result.canceled) return;

    const newUris = result.assets.map((a) => a.uri);
    onChange([...values, ...newUris].slice(0, maxCount));
  };

  const handleRemove = (uri: string) => {
    onChange(values.filter((v) => v !== uri));
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {values.map((uri) => (
          <Pressable
            key={uri}
            onLongPress={() => handleRemove(uri)}
            style={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: radii.md,
              overflow: 'hidden',
              borderWidth: 0.5,
              borderColor: colors.inkSoft,
            }}>
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          </Pressable>
        ))}
        {canAddMore && (
          <Pressable
            onPress={handleAdd}
            style={({ pressed }) => ({
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: radii.md,
              borderWidth: 1,
              borderColor: colors.inkSoft,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? colors.peachSoft : 'transparent',
            })}>
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: sizes.xl,
                color: colors.inkSoft,
              }}>
              +
            </Text>
          </Pressable>
        )}
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: sizes.xs, color: colors.inkSoft }}>
        {values.length} / {maxCount}장 · 길게 눌러 빼기
      </Text>
    </View>
  );
}
