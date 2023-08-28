import React from 'react';
import { App as Layout } from "./components/Layout"
import { setDefaultLanguage } from './locales/i18n';
import './assets/App.module.css';
import { ThemeProvider } from './assets/ThemeContext';
import { AuthProvider } from "./hooks/useContext";

export const App = () => {
  setDefaultLanguage('ja')
  const theme = {
    primaryColor: '#D7E6EF',
    secondaryColor: '#6E777C',
    tertiary: '#454C50'
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <div style={{ backgroundColor: theme.primaryColor, height: '100%' }}>
          <Layout />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}