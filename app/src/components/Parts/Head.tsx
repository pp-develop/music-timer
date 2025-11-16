import React from "react";
import ExpoHead from 'expo-router/head';
import { t } from '../../locales/i18n';

export const Head = () => {
    return (
        <ExpoHead>
            <title>{t('appName')}</title>
        </ExpoHead>
    );
}