/**
 * エラーページのフォールバックファイル
 *
 * このファイルは Expo Router の仕様により必須です。
 * プラットフォーム固有のファイル（error.android.tsx、error.web.tsx）が存在する場合でも、
 * フォールバック用のファイル（プラットフォーム拡張子なし）が必要になります。
 *
 * 現在の使用状況:
 * - Android: error.android.tsx が優先的に使用される
 * - Web: error.web.tsx が優先的に使用される
 * - iOS等その他: このファイルが使用される
 *
 * このファイルがないと以下のエラーが発生します:
 * "The file ./error.android.tsx does not have a fallback sibling file without a platform extension."
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '../locales/i18n';
import { Svg, Path } from 'react-native-svg';

const WarningIcon = () => (
  <Svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={2}>
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Path d="M12 9v4" stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 17h.01" stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export default function ErrorPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <WarningIcon />
      <Text style={styles.errorMessage}>{t('error.500.message')}</Text>
      <Text style={styles.errorDescription}>{t('error.500.description')}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>{t('error.500.home.back')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 24,
  },
  errorMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#FFFFFF',
  },
  errorDescription: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 32,
    color: '#9CA3AF',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#374151',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
