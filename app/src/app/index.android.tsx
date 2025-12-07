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
import { LinearGradient } from 'expo-linear-gradient';

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
                                <SpotifyLoginButton />
                                {/* <SoundCloudLoginButton /> */}
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
        flex: 1,
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
