import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { LoginButton } from "../features/auth";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from '../config/ThemeContext';
import { router } from 'expo-router';
import { t } from '../locales/i18n';
import { Text as TextBase } from "@rneui/base";
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
            {!isAuthenticated && (
                <>
                    <View style={styles.container}>
                        {loading ?
                            <View style={styles.indicator}>
                                <ActivityIndicator size="large" color={theme.tertiary} />
                            </View>
                            : <>

                                {/* Floating Elements */}
                                <View style={styles.floatingElements}>
                                    <View style={[styles.floatingCircle, styles.greenCircle]} />
                                    <View style={[styles.floatingCircle, styles.blueCircle]} />
                                </View>

                                {/* Glass Card */}
                                <View style={styles.card}>
                                    <Text style={styles.title}>音楽タイマー for Spotify</Text>
                                    <LoginButton />
                                </View>
                            </>
                        }
                    </View>
                    {/* TODO:: ドメイン統一後に削除 */}
                    {pressAuth && (
                        <TextBase
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
                        </TextBase>
                    )}
                </>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    indicator: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        height: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #1e2124 0%, #1a1c1f 50%, #000000 100%)',
    },
    floatingElements: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    floatingCircle: {
        width: 256,
        height: 256,
        borderRadius: 128,
        position: 'absolute',
        filter: 'blur(64px)',
    },
    greenCircle: {
        top: '25%',
        left: '25%',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
    },
    blueCircle: {
        bottom: '25%',
        right: '25%',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    card: {
        maxWidth: 480,
        width: '90%',
        padding: 32,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        gap: 32,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});