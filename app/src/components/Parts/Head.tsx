import React, { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { t } from '../../locales/i18n';

export const Head = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (Platform.OS !== 'web') {
      navigation.setOptions({
        title: t('appName'),
      });
    }
  }, [navigation]);

  if (Platform.OS === 'web') {
    return (
      <Helmet>
        <title>{t('appName')}</title>
      </Helmet>
    );
  }

  return null;
};
