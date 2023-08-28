import React from "react";
import { Text } from "@rneui/base";
import { t } from '../../locales/i18n';
import { useTheme } from '../../assets/ThemeContext';

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
          paddingTop: 25,
          paddingLeft: 25,
          paddingBottom: 12,
          paddingRight: 25,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%'
        }}
      >
        {t('top.description1')}
      </Text>
      <Text
        h3
        h3Style={{
          fontSize: 18,
          color: theme.tertiary,
        }}
        style={{
          paddingLeft: 25,
          paddingBottom: 12,
          paddingRight: 25,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%'
        }}
      >
        {t('top.description2')}
      </Text>
    </>
  );
}