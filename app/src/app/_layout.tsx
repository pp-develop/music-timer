import { ThemeProvider } from '../config/ThemeContext';
import { Header } from "../components/Parts/Header";
import { Head } from "../components/Parts/Head";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../components/CustomToast/toastConfig';

export default function Layout() {
  const theme = {
    primaryColor: '#D7E6EF',
    secondaryColor: '#6E777C',
    tertiary: '#454C50'
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
            <Head />
            <StatusBar style="light" translucent={false} backgroundColor="#000000" />
            <Slot />
          </SafeAreaView>
          <Toast config={toastConfig} />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
