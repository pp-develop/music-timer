import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, View, Platform } from 'react-native';
import { LoginButton } from "../features/auth";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from '../config/ThemeContext';
import { router } from 'expo-router';
import { t } from '../locales/i18n';
import { Text } from "@rneui/base";
import { Description } from "../components/Parts/Description";
import { setDefaultLanguage, getDefaultLanguage } from '../locales/i18n';
import usePageViewTracking from '../hooks/usePageViewTracking';

export default function Page() {
    // 言語が日本語でなければ英語をデフォルトに設定
    if (getDefaultLanguage() !== 'ja') {
        setDefaultLanguage('en');
    } else {
        setDefaultLanguage('ja');
    }

    usePageViewTracking(); // ページビューのトラッキングを有効化
    const theme = useTheme()
    const { loading, isAuthenticated } = useAuth();
    const [pressAuth, setPressAuth] = useState(false);

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/playlist');
        }
        // TODO:: ドメイン統一後に削除
        const pressAuthSession = sessionStorage.getItem('pressAuth');
        if (pressAuthSession === 'true') {
            setPressAuth(true);
        }
    }, [loading, isAuthenticated]);

    return (
        <>
            {loading && (
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={theme.tertiary} />
                </View>
            )}
            {!loading && (
                <>
                    {!isAuthenticated && (
                        <>
                            <Description />
                            <LoginButton />
                            {/* TODO:: ドメイン統一後に削除 */}
                            {pressAuth && (
                                <Text
                                    h3
                                    h3Style={{
                                        fontSize: 14,
                                        color: 'red'
                                    }}
                                    style={{
                                        maxWidth: 250,
                                        marginTop: 10,
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        width: '100%'
                                    }}
                                >
                                    {t('top.description3')}
                                </Text>
                            )}
                        </>
                    )}
                </>
            )}
        </>)
}

const styles = StyleSheet.create({
    indicator: {
        marginTop: '100px',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 28,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: '#6E777C',
        marginTop: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    desc: {
        paddingTop: 15,
        paddingBottom: 12,
        maxWidth: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        color: "#454C50"
    },
    descLink: {
        color: "#4d4dff"
    }
});