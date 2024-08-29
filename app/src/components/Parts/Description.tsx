import React from "react";
import { Text } from "@rneui/base";
import { t } from '../../locales/i18n';
import { useTheme } from '../../config/ThemeContext';

export const Description = () => {
  const theme = useTheme()
  return (
    <>
      <Text
        h3
        h3Style={{
          fontSize: 20,
          color: theme.tertiary,
        }}
        style={{
          marginTop: 25,
          marginBottom: 12,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '80%'
        }}
      >
        {t('top.description1')}
      </Text>
      <Text
        h3
        h3Style={{
          fontSize: 14,
          color: theme.tertiary,
        }}
        style={{
          marginBottom: 12,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '80%'
        }}
      >
        {t('top.description2')}
      </Text>
    </>
  );
}