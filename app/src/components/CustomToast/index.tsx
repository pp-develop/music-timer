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
        iconBg: 'rgba(5, 150, 105, 0.15)',
        border: 'rgba(5, 150, 105, 0.3)',
        background: 'rgba(55, 65, 81, 0.95)',
    },
    error: {
        icon: '#DC2626',      // Error Red
        iconBg: 'rgba(220, 38, 38, 0.15)',
        border: 'rgba(220, 38, 38, 0.3)',
        background: 'rgba(55, 65, 81, 0.95)',
    },
    info: {
        icon: '#3B82F6',      // Accent Blue
        iconBg: 'rgba(59, 130, 246, 0.15)',
        border: 'rgba(59, 130, 246, 0.3)',
        background: 'rgba(55, 65, 81, 0.95)',
    },
};

/**
 * 成功アイコン（チェックマーク）
 */
const SuccessIcon: React.FC<{ color: string }> = ({ color }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path
            d="M6 12L10 16L18 8"
            stroke={color}
            strokeWidth={2.5}
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
    <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path
            d="M12 8V12M12 16V16.01"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
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
            <Svg width={24} height={24} viewBox="0 0 24 24">
                <Circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="45, 15"
                />
            </Svg>
        </Animated.View>
    );
};

/**
 * カスタムトーストコンポーネント
 * DisabledToastと統一されたデザイン
 */
export const CustomToast: React.FC<ToastConfigParams<any>> = ({ text1, text2, type = 'info' }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        // 上から降りてくるアニメーション
        Animated.parallel([
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
                    borderColor: colors.border,
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            {/* アイコン部分 */}
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: colors.iconBg },
                ]}
            >
                <IconComponent color={colors.icon} />
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
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 'auto',
        marginTop: 10,
        // iOS用シャドウ
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        // Android用シャドウ
        elevation: 8,
        // ボーダー
        borderWidth: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textSection: {
        flex: 1,
        justifyContent: 'center',
    },
    text1: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    text2: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        lineHeight: 20,
    },
});
