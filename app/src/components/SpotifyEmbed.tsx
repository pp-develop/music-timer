import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface SpotifyEmbedProps {
    link: string;
    width?: number | string;
    height?: number | string;
    style?: any;
}

/**
 * Spotify埋め込みプレーヤーのラッパーコンポーネント
 * Web版では従来のiframe、ネイティブ版ではWebViewを使用
 */
export const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({
    link,
    width = '100%',
    height = 352,
    style
}) => {
    // プレイリストIDを抽出
    const playlistId = link.split('/playlist/')[1]?.split('?')[0];

    if (!playlistId) {
        console.error('Invalid Spotify playlist link:', link);
        return null;
    }

    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;

    if (Platform.OS === 'web') {
        // Web版では従来通りiframeを使用
        // @ts-ignore - iframe is a valid web element
        return (
            <iframe
                src={embedUrl}
                width={typeof width === 'number' ? `${width}px` : width}
                height={typeof height === 'number' ? `${height}px` : height}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={style}
            />
        );
    }

    // iOS/Android版ではWebViewを使用
    return (
        <View style={[
            styles.container,
            style,
            {
                width: typeof width === 'number' ? width : undefined,
                height: typeof height === 'number' ? height : undefined,
            }
        ]}>
            <WebView
                source={{ uri: embedUrl }}
                style={styles.webview}
                scrollEnabled={false}
                bounces={false}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 12,
    },
    webview: {
        backgroundColor: 'transparent',
    },
});
