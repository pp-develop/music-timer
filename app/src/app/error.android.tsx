import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '../locales/i18n';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.errorCode}>500</Text>
      <Text style={styles.errorMessage}>{t('error.500.message')}</Text>
      <Text style={styles.errorDescription}>{t('error.500.description')}</Text>
      <Text style={{ color: 'blue' }} onPress={() => router.push('/')}>{t('error.500.home.back')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 500
  },
  errorCode: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorDescription: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 10
  },
});
