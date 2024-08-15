import { setDefaultLanguage, getDefaultLanguage } from '../locales/i18n';
import { ThemeProvider } from '../config/ThemeContext';
import { Header } from "../components/Parts/Header"
import { Head } from "../components/Parts/Head"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import React from "react";
import { View } from 'react-native';
import { Slot } from 'expo-router';

export default function Layout() {
  // 現在の言語を取得
  const currentLanguage = getDefaultLanguage();

  // 言語が日本語でなければ英語をデフォルトに設定
  if (currentLanguage !== 'ja') {
    setDefaultLanguage('en');
  } else {
    setDefaultLanguage('ja');
  }

  const theme = {
    primaryColor: '#D7E6EF',
    secondaryColor: '#6E777C',
    tertiary: '#454C50'
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={{
        backgroundColor: theme.primaryColor,
        flex: 1, // heightの代わりにflexを使用
        width: '100%',
        overflow: "auto"
      }}>
        <StatusBar style="auto" backgroundColor={theme.primaryColor} />
        <SafeAreaProvider>
          <AuthProvider>
            <HelmetProvider>
              <Head />
            </HelmetProvider>
            <Header />
            <Slot />
          </AuthProvider>
        </SafeAreaProvider>
      </View>
    </ThemeProvider>
  )
}