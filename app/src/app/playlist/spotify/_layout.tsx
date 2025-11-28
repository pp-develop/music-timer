/**
 * Spotifyプレイリストページのレイアウトフォールバックファイル
 *
 * このファイルは通常使用されることはありませんが、Expo Router の仕様により必須です。
 * プラットフォーム固有のファイル（_layout.android.tsx、_layout.web.tsx）が存在する場合でも、
 * フォールバック用のファイル（プラットフォーム拡張子なし）が必要になります。
 *
 * 現在の使用状況:
 * - Android: _layout.android.tsx が優先的に使用される
 * - Web: _layout.web.tsx が優先的に使用される
 * - iOS等その他: このファイルが使用される（念のため）
 *
 * 実装内容: _layout.web.tsx と同等の内容
 */

import React, { useEffect } from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';
import { Form } from "../../../features/spotify/createPlaylist";
import { useSpotifyAuth } from "../../../hooks/useSpotifyAuth";
import { useTheme } from '../../../config/ThemeContext';
import { router } from 'expo-router';
import { PlaylistProvider } from '../../../features/spotify/deletePlaylist/hooks/useContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MAX_CONTAINER_WIDTH } from '../../../config';

export default function Layout() {
    const theme = useTheme()
    const { loading, isAuthenticated } = useSpotifyAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/');
        }
    }, [loading, isAuthenticated]);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#111827', '#000000']}
                style={styles.gradient}
            >
                <View style={styles.contentWrapper}>
                    <View style={styles.content}>
                        {loading && (
                            <View style={styles.indicator}>
                                <ActivityIndicator size="large" color={theme.tertiary} />
                            </View>
                        )}
                        {!loading && (
                            <>
                                {isAuthenticated && (
                                    <>
                                        <PlaylistProvider>
                                            <Form />
                                        </PlaylistProvider>
                                    </>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
    },
    contentWrapper: {
        width: '100%',
        maxWidth: MAX_CONTAINER_WIDTH,
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        backgroundColor: 'rgba(31, 41, 55, 1)',
        display: 'flex',
        flexDirection: 'column',
    },
    indicator: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
