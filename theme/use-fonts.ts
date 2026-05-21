import { NotoSerifKR_500Medium, NotoSerifKR_700Bold } from '@expo-google-fonts/noto-serif-kr';
import { GowunDodum_400Regular } from '@expo-google-fonts/gowun-dodum';
import { CormorantGaramond_400Regular_Italic } from '@expo-google-fonts/cormorant-garamond';
import { useFonts } from 'expo-font';

export function useDattaFonts() {
  return useFonts({
    NotoSerifKR_500Medium,
    NotoSerifKR_700Bold,
    GowunDodum_400Regular,
    CormorantGaramond_400Regular_Italic,
  });
}
