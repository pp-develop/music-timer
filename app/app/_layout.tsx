import { setDefaultLanguage } from './locales/i18n';
import { ThemeProvider } from './assets/ThemeContext';
import { AuthProvider } from "./hooks/useContext";
import { Header } from "./components/Parts/Header"
import { Head } from "./components/Parts/Head"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelmetProvider } from 'react-helmet-async'
import { StatusBar } from 'expo-status-bar';
import React from "react";
import { Slot } from 'expo-router';

export default function Layout() {
  setDefaultLanguage('ja')
  const theme = {
    primaryColor: '#D7E6EF',
    secondaryColor: '#6E777C',
    tertiary: '#454C50'
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <div style={{
          backgroundColor: theme.primaryColor, height: '100%', width: '100%'
        }}>
          <StatusBar style="auto" backgroundColor={theme.primaryColor} />
          <SafeAreaProvider>
            <HelmetProvider>
              <Head />
            </HelmetProvider>
            <Header />
            <Slot />
          </SafeAreaProvider>

        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}