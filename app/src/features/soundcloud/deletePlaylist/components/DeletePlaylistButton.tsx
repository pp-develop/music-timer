import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { deletePlaylist } from '../api/DeletePlaylist';
import { t } from '../../../../locales/i18n';
import Toast from 'react-native-toast-message';
import PlaylistContext from '../hooks/useContext';
import { getPlaylist } from '../api/GetPlaylist';
import ReactGA from 'react-ga4';
import { Svg, Path, Line, Polyline, Circle } from 'react-native-svg';

/**
 * Delete Playlist Button - FAB Style
 * - Material Design風の浮遊感のあるボタン
 * - 強い黒色シャドウで存在感を演出
 * - 押下時のスケールアニメーション
 * - リップル効果
 */

const BUTTON_COLORS = {
    background: '#DC2626',
    ripple: 'rgba(255, 255, 255, 0.2)',
};

/**
 * ゴミ箱アイコン
 */
const TrashIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Polyline points="3 6 5 6 21 6" />
        <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <Line x1="10" y1="11" x2="10" y2="17" />
        <Line x1="14" y1="11" x2="14" y2="17" />
    </Svg>
);

/**
 * ローディングスピナー
 */
const LoadingSpinner = () => {
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
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="45, 15"
                />
            </Svg>
        </Animated.View>
    );
};

export const DeletePlaylist = (props: any) => {
    const [loading, setLoading] = useState(false);
    const { showDeleteButton, setShowDeleteButton } = useContext(PlaylistContext);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const playlistData = await getPlaylist();
                if (playlistData.httpStatus == 200 && !playlistData.playlistIDs) {
                    setShowDeleteButton(false)
                } else if (playlistData.httpStatus == 200 && playlistData.playlistIDs?.length > 0) {
                    setShowDeleteButton(true)
                }
            } catch (err) {
                setShowDeleteButton(true)
            }
        }

        fetchPlaylist();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = async () => {
        ReactGA.event({
            category: 'User Interaction',
            action: 'Click',
            label: 'SoundCloud Delete Playlist Button'
        });

        setLoading(true);

        Toast.show({
            type: 'info',
            text1: t('toast.playlistDeleting'),
            position: 'top',
        });

        try {
            await deletePlaylist();

            Toast.show({
                type: 'success',
                text1: t('toast.playlistDeleted'),
                position: 'top',
                visibilityTime: 3000,
            });

            setShowDeleteButton(false)
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t('toast.playlistDeleteError'),
                position: 'top',
                visibilityTime: 4000,
            });

            setShowDeleteButton(true)
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {showDeleteButton && (
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        onPress={handlePress}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={loading}
                        activeOpacity={0.9}
                        style={[styles.deleteButton, loading && styles.deleteButtonLoading]}
                    >
                        {/* リップル効果 */}
                        <View style={styles.ripple} />

                        {/* アイコン */}
                        {loading ? <LoadingSpinner /> : <TrashIcon />}
                    </TouchableOpacity>
                </Animated.View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    deleteButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: BUTTON_COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        // iOS Shadow (Strong)
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        // Android Shadow (Strong)
        elevation: 8,
    },
    deleteButtonLoading: {
        opacity: 0.85,
    },
    ripple: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: BUTTON_COLORS.ripple,
        borderRadius: 16,
    },
});
