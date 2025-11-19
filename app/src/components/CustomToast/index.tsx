import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import type { ToastConfigParams } from 'react-native-toast-message';

/**
 * トーストアイコンの種類
 */
type ToastType = 'success' | 'error' | 'info';

/**
 * トーストのカラー設定
 */
const TOAST_COLORS = {
    success: {
        icon: '#059669',      // Success Green
        glow: 'rgba(5, 150, 105, 0.3)',
        glowMiddle: 'rgba(5, 150, 105, 0.15)',
        glowOuter: 'rgba(5, 150, 105, 0.08)',
        background: 'rgba(55, 65, 81, 0.95)',
    },
    error: {
        icon: '#DC2626',      // Error Red
        glow: 'rgba(220, 38, 38, 0.3)',
        glowMiddle: 'rgba(220, 38, 38, 0.15)',
        glowOuter: 'rgba(220, 38, 38, 0.08)',
        background: 'rgba(55, 65, 81, 0.95)',
    },
    info: {
        icon: '#3B82F6',      // Accent Blue
        glow: 'rgba(59, 130, 246, 0.3)',
        glowMiddle: 'rgba(59, 130, 246, 0.15)',
        glowOuter: 'rgba(59, 130, 246, 0.08)',
        background: 'rgba(55, 65, 81, 0.95)',
    },
};

/**
 * 成功アイコン（チェックマーク）
 */
const SuccessIcon: React.FC<{ color: string }> = ({ color }) => (
    <Svg width={70} height={70} viewBox="0 0 70 70">
        {/* チェックマーク */}
        <Path
            d="M20 35L30 45L50 25"
            stroke="white"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </Svg>
);

/**
 * エラーアイコン（感嘆符）
 */
const ErrorIcon: React.FC<{ color: string }> = ({ color }) => (
    <Svg width={70} height={70} viewBox="0 0 70 70">
        {/* 感嘆符のドット */}
        <Path
            d="M38 52C38 53.66 36.66 55 35 55C33.34 55 32 53.66 32 52C32 50.34 33.34 49 35 49C36.66 49 38 50.34 38 52Z"
            fill="white"
        />
        {/* 感嘆符の棒 */}
        <Path
            d="M32 18C32 16.34 33.34 15 35 15C36.66 15 38 16.34 38 18V40C38 41.66 36.66 43 35 43C33.34 43 32 41.66 32 40V18Z"
            fill="white"
        />
    </Svg>
);

/**
 * 情報アイコン（ローディングスピナー）
 */
const InfoIcon: React.FC<{ color: string }> = ({ color }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            rotation.setValue(0);
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => animate());
        };
        animate();
    }, []);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Svg width={70} height={70} viewBox="0 0 70 70">
                {/* スピナー円弧 */}
                <Circle
                    cx="35"
                    cy="35"
                    r="15"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="70, 20"
                />
            </Svg>
        </Animated.View>
    );
};

/**
 * カスタムトーストコンポーネント
 * FormOverlaysのErrorOverlayと統一されたデザイン
 */
export const CustomToast: React.FC<ToastConfigParams<any>> = ({ text1, text2, type = 'info' }) => {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        // スプリングアニメーション（柔らかく優しい印象）
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const toastType = (type as ToastType) || 'info';
    const colors = TOAST_COLORS[toastType];

    const IconComponent = toastType === 'success'
        ? SuccessIcon
        : toastType === 'error'
        ? ErrorIcon
        : InfoIcon;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    opacity,
                    transform: [
                        { scale },
                        { translateY }
                    ],
                },
            ]}
        >
            {/* アイコン部分（3層グロー効果） */}
            <View style={styles.iconSection}>
                <View style={styles.iconContainer}>
                    {/* グロー効果（外側） */}
                    <View
                        style={[
                            styles.iconGlowOuter,
                            { backgroundColor: colors.glowOuter },
                        ]}
                    />
                    {/* グロー効果（中間） */}
                    <View
                        style={[
                            styles.iconGlowMiddle,
                            { backgroundColor: colors.glowMiddle },
                        ]}
                    />
                    {/* メインアイコン円 */}
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: colors.icon },
                        ]}
                    >
                        {/* ハイライト効果（立体感） */}
                        <View style={styles.iconHighlight} />
                        {/* アイコンシンボル */}
                        <IconComponent color={colors.icon} />
                    </View>
                </View>
            </View>

            {/* テキスト部分 */}
            <View style={styles.textSection}>
                {text1 && (
                    <Text style={styles.text1} numberOfLines={2}>
                        {text1}
                    </Text>
                )}
                {text2 && (
                    <Text style={styles.text2} numberOfLines={2}>
                        {text2}
                    </Text>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        maxWidth: 420,
        borderRadius: 20,
        padding: 16,
        paddingVertical: 14,
        marginHorizontal: 'auto',
        marginTop: 10,
        // iOS用シャドウ
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        // Android用シャドウ
        elevation: 10,
        // Web版のボーダー
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconSection: {
        marginRight: 14,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 70,
        height: 70,
    },
    iconGlowOuter: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    iconGlowMiddle: {
        position: 'absolute',
        width: 78,
        height: 78,
        borderRadius: 39,
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        // iOS用シャドウ
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        // Android用シャドウ
        elevation: 6,
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
    textSection: {
        flex: 1,
        justifyContent: 'center',
    },
    text1: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        letterSpacing: 0.2,
        marginBottom: 2,
    },
    text2: {
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
        letterSpacing: 0.1,
    },
});
