/**
 * ホームページのフォールバックファイル
 *
 * このファイルは通常使用されることはありませんが、Expo Router の仕様により必須です。
 * プラットフォーム固有のファイル（index.android.tsx、index.web.tsx）が存在する場合でも、
 * フォールバック用のファイル（プラットフォーム拡張子なし）が必要になります。
 *
 * 現在の使用状況:
 * - Android: index.android.tsx が優先的に使用される
 * - Web: index.web.tsx が優先的に使用される
 * - iOS等その他: このファイルが使用される（念のため）
 *
 * 実装内容: index.web.tsx と同等の内容
 */

import React, { useEffect } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { LoginButton as SpotifyLoginButton } from "../features/spotify/auth";
import { LoginButton as SoundCloudLoginButton } from "../features/soundcloud/auth";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { useSoundCloudAuth } from "../hooks/useSoundCloudAuth";
import { useTheme } from '../config/ThemeContext';
import { router } from 'expo-router';
import { t } from '../locales/i18n';
import usePageViewTracking from '../hooks/usePageViewTracking';

export default function Page() {
    usePageViewTracking(); // ページビューのトラッキングを有効化
    const theme = useTheme()
    const { loading: spotifyLoading, isAuthenticated: spotifyAuthenticated } = useSpotifyAuth();
    const { loading: soundcloudLoading, isAuthenticated: soundcloudAuthenticated } = useSoundCloudAuth();

    const loading = spotifyLoading || soundcloudLoading;
    const isAuthenticated = spotifyAuthenticated || soundcloudAuthenticated;

    useEffect(() => {
        if (!loading) {
            if (spotifyAuthenticated) {
                router.replace('/spotify/playlist');
            } else if (soundcloudAuthenticated) {
                router.replace('/soundcloud/playlist');
            }
        }
    }, [loading, spotifyAuthenticated, soundcloudAuthenticated]);

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
                                    <Text style={styles.title}>
                                        {t('appName')}
                                    </Text>
                                    <SpotifyLoginButton />
                                    <SoundCloudLoginButton />
                                </View>
                            </>
                        }
                    </View>
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
