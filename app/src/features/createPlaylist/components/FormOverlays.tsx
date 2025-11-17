import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Pressable, Image } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Spotify } from 'react-spotify-embed';
import { t } from '../../../locales/i18n';

const { height } = Dimensions.get('window');

/**
 * ローディングオーバーレイのProps
 */
interface LoadingOverlayProps {
    opacity: Animated.Value;
    waveAnimations: Animated.Value[];
}

/**
 * ローディングオーバーレイコンポーネント
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ opacity, waveAnimations }) => (
    <Animated.View
        style={[
            styles.loadingOverlay,
            { opacity }
        ]}
    >
        <View style={styles.loadingContainer}>
            <View style={styles.waveContainer}>
                {waveAnimations.map((anim, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.waveBar,
                            {
                                transform: [
                                    {
                                        scaleY: anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.3, 1]
                                        })
                                    }
                                ],
                                opacity: anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.4, 1]
                                })
                            }
                        ]}
                    />
                ))}
            </View>

            <Text style={styles.loadingTitle}>{t('dialog.loading.title')}</Text>
            <Text style={styles.loadingSubtext}>{t('dialog.loading.subtitle')}</Text>
        </View>
    </Animated.View>
);

/**
 * エラーオーバーレイのProps
 */
interface ErrorOverlayProps {
    opacity: Animated.Value;
    errorMessage: string;
    creationStatus: 'idle' | 'success' | 'failure';
}

/**
 * エラーオーバーレイコンポーネント
 */
export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ opacity, errorMessage, creationStatus }) => (
    <Animated.View
        style={[
            styles.failureOverlay,
            {
                opacity,
                pointerEvents: creationStatus === 'failure' ? 'auto' : 'none'
            }
        ]}
    >
        <View style={styles.failureContainer}>
            <Text style={styles.failureTitle}>
                {t('dialog.createPlaylist.not.created.title')}
            </Text>
            <Text style={styles.failureSubtext}>
                {errorMessage || t('dialog.createPlaylist.not.created')}
            </Text>
        </View>
    </Animated.View>
);

/**
 * プレイリスト成功画面のProps
 */
interface PlaylistSuccessScreenProps {
    isAnimating: boolean;
    playlistId: string;
    translateY: Animated.Value;
    swipeIndicatorOpacity: Animated.Value;
    swipeIndicatorTranslateY: Animated.Value;
    panResponder: any;
    spotifyPanResponder: any;
    onClose: () => void;
    onOpenSpotify: () => void;
}

/**
 * プレイリスト成功画面コンポーネント
 */
export const PlaylistSuccessScreen: React.FC<PlaylistSuccessScreenProps> = ({
    isAnimating,
    playlistId,
    translateY,
    swipeIndicatorOpacity,
    swipeIndicatorTranslateY,
    panResponder,
    spotifyPanResponder,
    onClose,
    onOpenSpotify,
}) => {
    if (!isAnimating) return null;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.playlistScreen,
                {
                    transform: [{ translateY }]
                }
            ]}
        >
            {/* フェードアウトするスワイプインジケーター */}
            <Animated.View
                style={[
                    styles.swipeIndicatorContainer,
                    {
                        opacity: swipeIndicatorOpacity,
                        transform: [{ translateY: swipeIndicatorTranslateY }]
                    }
                ]}
            >
                <View style={styles.swipeBarContainer}>
                    <View style={styles.swipeBar} />
                </View>

                <View style={styles.swipeArrowContainer}>
                    <Svg width={16} height={8} viewBox="0 0 16 8" fill="none">
                        <Path
                            d="M1 1L8 7L15 1"
                            stroke="white"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </View>
            </Animated.View>

            {/* クローズボタンを追加 */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
            >
                <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            {/* タイトルを下に移動 */}
            <Text style={styles.playlistTitle}>{t('dialog.createPlaylist.title')}</Text>

            {/* Spotifyプレイリスト - オーバーレイでスワイプに対応 */}
            <View style={styles.spotifyContainer}>
                <Spotify
                    link={"https://open.spotify.com/playlist/" + playlistId}
                    style={{ width: "100%" }}
                />
                <View
                    {...spotifyPanResponder.panHandlers}
                    style={[styles.spotifyOverlay, { pointerEvents: "none" }]}
                />
            </View>

            {/* Spotifyで開くボタン */}
            <Pressable
                style={[
                    {
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 14,
                        paddingHorizontal: 24,
                        borderRadius: 12,
                        backgroundColor: "#454C50",
                        marginTop: 25,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        flexDirection: 'row',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }
                ]}
                onPress={onOpenSpotify}
            >
                {({ pressed }) => (
                    <>
                        <Image
                            source={require('../../../../assets/images/spotify-icon.png')}
                            style={{
                                width: 25,
                                height: 25,
                                marginRight: 10,
                                opacity: pressed ? 0.7 : 1
                            }}
                        />
                        <Text style={[
                            styles.buttonText,
                            {
                                color: pressed ? 'rgba(255,255,255,0.7)' : 'white',
                                fontSize: 16,
                            }
                        ]}>
                            {t('dialog.createPlaylist.open')}
                        </Text>
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(31,41,55,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'none'
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(55,65,81,0.2)',
        borderRadius: 20,
        padding: 30,
        width: '80%'
    },
    waveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        height: 50
    },
    waveBar: {
        width: 10,
        height: 30,
        backgroundColor: '#3B82F6',
        marginHorizontal: 5,
        borderRadius: 5
    },
    loadingTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10
    },
    loadingSubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center'
    },
    failureOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(31, 41, 55)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 150,
    },
    failureContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 30,
        width: '80%',
        alignItems: 'center'
    },
    failureTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    failureSubtext: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        textAlign: 'center'
    },
    playlistScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(31,41,55,0.9)',
        padding: 20,
        zIndex: 20
    },
    swipeIndicatorContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5,
        paddingVertical: 8
    },
    swipeBarContainer: {
        width: 40,
        height: 5,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    swipeBar: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3
    },
    swipeArrowContainer: {
        height: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4
    },
    closeButton: {
        position: 'absolute',
        marginTop: 40,
        right: 20,
        zIndex: 10
    },
    closeButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    playlistTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20
    },
    spotifyContainer: {
        width: '100%',
        position: 'relative',
        height: height > 600 ? height * 0.6 : 'auto',
        aspectRatio: 16 / 9,
    },
    spotifyOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
