import React from "react";
import { Helmet } from 'react-helmet-async'
import {t} from '../../locales/i18n';

export const Head = () => {
    return (
        <Helmet>
            <title>{t('appName')}</title>
        </Helmet>
    );
}