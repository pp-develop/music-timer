import { ThemeProvider } from '../config/ThemeContext';
import { Header } from "../components/Parts/Header";
import { Head } from "../components/Parts/Head";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import React from "react";
import { Slot } from 'expo-router';
import { ScrollView } from 'react-native';

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
          <HelmetProvider>
            <Head />
          </HelmetProvider>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, width: '100%', backgroundColor: theme.primaryColor}}
          >
            <StatusBar style="auto" backgroundColor={theme.primaryColor} />
            <Header />
            <Slot />
          </ScrollView>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
