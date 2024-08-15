import React from 'react';
import { Platform, Text, View } from 'react-native';
import { Helmet } from 'react-helmet-async';
import { t } from '../../locales/i18n';

export const Head = () => {
    if (Platform.OS === 'web') {
        return (
            <Helmet>
                <title>{t('appName')}</title>
            </Helmet>
        );
    }
    // React Native 環境では別の方法でタイトルを表示
    return (
        <View>
            <Text>{t('appName')}</Text>
        </View>
    );
};
