import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Pressable, Image, Platform, BackHandler } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { t } from '../../../../locales/i18n';
import { SoundCloudEmbed } from '../../../../components/SoundCloudEmbed';

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
    onDismiss?: () => void;
}

/**
 * エラーオーバーレイコンポーネント
 */
export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ opacity, errorMessage, creationStatus, onDismiss }) => {
    const [iconScale] = React.useState(new Animated.Value(0));
    const [containerScale] = React.useState(new Animated.Value(0.8));
    const [iconRotate] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (creationStatus === 'failure') {
            Animated.parallel([
                Animated.spring(containerScale, {
                    toValue: 1,
                    friction: 10,
                    tension: 20,
                    useNativeDriver: true
                }),
                Animated.sequence([
                    Animated.spring(iconScale, {
                        toValue: 1.05,
                        friction: 6,
                        tension: 40,
                        useNativeDriver: true
                    }),
                    Animated.spring(iconScale, {
                        toValue: 1,
                        friction: 5,
                        useNativeDriver: true
                    })
                ]),
                Animated.sequence([
                    Animated.timing(iconRotate, {
                        toValue: 0.1,
                        duration: 200,
                        useNativeDriver: true
                    }),
                    Animated.timing(iconRotate, {
                        toValue: -0.1,
                        duration: 200,
                        useNativeDriver: true
                    }),
                    Animated.timing(iconRotate, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true
                    })
                ])
            ]).start();
        } else {
            iconScale.setValue(0);
            containerScale.setValue(0.9);
            iconRotate.setValue(0);
        }
    }, [creationStatus]);

    const rotateInterpolate = iconRotate.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-10deg', '10deg']
    });

    return (
        <Animated.View
            style={[
                styles.failureOverlay,
                {
                    opacity,
                    pointerEvents: creationStatus === 'failure' ? 'auto' : 'none'
                }
            ]}
        >
            <Pressable
                style={styles.failureContainerWrapper}
                onPress={onDismiss}
            >
                <Animated.View
                    style={[
                        styles.failureContainer,
                        {
                            transform: [{ scale: containerScale }]
                        }
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.errorIconContainer,
                            {
                                transform: [
                                    { scale: iconScale },
                                    { rotate: rotateInterpolate }
                                ]
                            }
                        ]}
                    >
                        <View style={styles.iconGlowOuter} />
                        <View style={styles.iconGlowMiddle} />
                        <View style={styles.iconCircle}>
                            <View style={styles.iconHighlight} />
                            <Svg width={70} height={70} viewBox="0 0 70 70" style={styles.iconSymbol}>
                                <Path
                                    d="M38 52C38 53.66 36.66 55 35 55C33.34 55 32 53.66 32 52C32 50.34 33.34 49 35 49C36.66 49 38 50.34 38 52Z"
                                    fill="white"
                                />
                                <Path
                                    d="M32 18C32 16.34 33.34 15 35 15C36.66 15 38 16.34 38 18V40C38 41.66 36.66 43 35 43C33.34 43 32 41.66 32 40V18Z"
                                    fill="white"
                                />
                            </Svg>
                        </View>
                    </Animated.View>

                    <Text style={styles.failureTitle}>
                        {t('dialog.createPlaylist.not.created.title')}
                    </Text>
                    <Text style={styles.failureSubtext}>
                        {errorMessage || t('dialog.createPlaylist.not.created')}
                    </Text>
                    <View style={styles.dismissHintContainer}>
                        <View style={styles.dismissHintDot} />
                        <Text style={styles.tapToCloseText}>
                            {t('dialog.tapToClose')}
                        </Text>
                    </View>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

/**
 * プレイリスト成功画面のProps
 */
interface PlaylistSuccessScreenProps {
    isAnimating: boolean;
    playlistId: string;
    secretToken?: string;
    translateY: Animated.Value;
    swipeIndicatorOpacity: Animated.Value;
    swipeIndicatorTranslateY: Animated.Value;
    panResponder: any;
    soundcloudPanResponder: any;
    onClose: () => void;
    onOpenSoundCloud: () => void;
}

/**
 * プレイリスト成功画面コンポーネント
 */
export const PlaylistSuccessScreen: React.FC<PlaylistSuccessScreenProps> = ({
    isAnimating,
    playlistId,
    secretToken,
    translateY,
    swipeIndicatorOpacity,
    swipeIndicatorTranslateY,
    panResponder,
    soundcloudPanResponder,
    onClose,
    onOpenSoundCloud,
}) => {
    useEffect(() => {
        if (Platform.OS !== 'android') return;
        if (!isAnimating) return;

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                onClose();
                return true;
            }
        );

        return () => backHandler.remove();
    }, [isAnimating, onClose]);

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

            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
            >
                <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.playlistTitle}>{t('dialog.createPlaylist.title')}</Text>

            {/* SoundCloudプレイリスト埋め込み */}
            <View style={styles.soundcloudContainer}>
                <SoundCloudEmbed
                    playlistId={playlistId}
                    secretToken={secretToken}
                    width="100%"
                    height={300}
                />
                <View
                    {...soundcloudPanResponder.panHandlers}
                    style={[styles.soundcloudOverlay, { pointerEvents: "none" }]}
                />
            </View>

            {/* SoundCloudで開くボタン */}
            <Pressable
                style={[
                    {
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 14,
                        paddingHorizontal: 24,
                        borderRadius: 12,
                        backgroundColor: "#FF5500",
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
                onPress={onOpenSoundCloud}
            >
                {({ pressed }) => (
                    <>
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
        backgroundColor: '#FF5500',
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
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 150,
    },
    failureContainerWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    failureContainer: {
        backgroundColor: 'rgba(55, 65, 81, 0.85)',
        borderRadius: 32,
        padding: 36,
        width: '85%',
        maxWidth: 420,
        alignItems: 'center',
        shadowColor: '#FF5500',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 15,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 85, 0, 0.3)',
    },
    failureTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 14,
        textAlign: 'center',
        letterSpacing: 0,
    },
    failureSubtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 23,
        letterSpacing: 0.1,
        fontWeight: '400',
    },
    errorIconContainer: {
        marginBottom: 28,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 110,
        height: 110,
    },
    iconGlowOuter: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(255, 85, 0, 0.08)',
    },
    iconGlowMiddle: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255, 85, 0, 0.15)',
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FF5500',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF5500',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
    },
    iconHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 35,
    },
    iconSymbol: {
        position: 'absolute',
    },
    dismissHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 22,
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    dismissHintDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(255, 85, 0, 0.6)',
        marginRight: 8,
    },
    tapToCloseText: {
        color: 'rgba(255, 255, 255, 0.45)',
        fontSize: 12.5,
        textAlign: 'center',
        letterSpacing: 0.2,
        fontWeight: '400',
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
    soundcloudContainer: {
        width: '100%',
        position: 'relative',
        minHeight: 200,
    },
    soundcloudPlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: 'rgba(55, 65, 81, 0.5)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 85, 0, 0.3)',
    },
    soundcloudText: {
        color: 'white',
        marginTop: 16,
        fontSize: 14,
    },
    soundcloudOverlay: {
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
