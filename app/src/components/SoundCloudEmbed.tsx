import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface SoundCloudEmbedProps {
    playlistId: string;
    secretToken?: string;
    width?: number | string;
    height?: number | string;
    style?: any;
}

/**
 * SoundCloud埋め込みプレーヤーのラッパーコンポーネント
 * Web版ではiframe、ネイティブ版ではWebViewを使用
 */
export const SoundCloudEmbed: React.FC<SoundCloudEmbedProps> = ({
    playlistId,
    secretToken,
    width = '100%',
    height = 300,
    style
}) => {
    if (!playlistId) {
        console.error('Invalid SoundCloud playlist ID');
        return null;
    }

    // SoundCloud Widget URL構築
    let embedUrl = `https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/${playlistId}`;

    // secret_tokenがあればURLに追加（プライベートプレイリスト用）
    if (secretToken) {
        embedUrl += `?secret_token=${secretToken}`;
    }

    // 追加パラメータ
    embedUrl += '&color=%23FF5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false';

    if (Platform.OS === 'web') {
        // Web版ではiframeを使用
        // @ts-ignore - iframe is a valid web element
        return (
            <iframe
                src={embedUrl}
                width={typeof width === 'number' ? `${width}px` : width}
                height={typeof height === 'number' ? `${height}px` : height}
                frameBorder="0"
                allow="autoplay"
                scrolling="no"
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
