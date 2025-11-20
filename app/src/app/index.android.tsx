import React, { useEffect } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Dimensions
} from 'react-native';
import { LoginButton } from "../features/auth";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from '../config/ThemeContext';
import { router } from 'expo-router';
import { t } from '../locales/i18n';
import { setDefaultLanguage, getDefaultLanguage } from '../locales/i18n';
import usePageViewTracking from '../hooks/usePageViewTracking';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/playlist');
        }
    }, [loading, isAuthenticated]);

    return (
        <>
            {!isAuthenticated && (
                <LinearGradient
                    colors={['#1e2124', '#1a1c1f', '#000000']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {loading ?
                        <View style={styles.indicator}>
                            <ActivityIndicator size="large" color={theme.tertiary} />
                        </View>
                        : (
                            <View style={styles.card}>
                                <Text style={styles.title}>
                                    {t('appName')}
                                </Text>
                                <LoginButton />
                            </View>
                        )
                    }
                </LinearGradient>
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
        height: SCREEN_HEIGHT,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        maxWidth: 480,
        width: '90%',
        padding: 32,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
