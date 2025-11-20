import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { logout as RequestLogout } from '../api/auth'
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import { useAuth } from "../../../../src/hooks/useAuth";
import { router } from 'expo-router';
import ReactGA from 'react-ga4';
import { Svg, Path, Line, Polyline } from 'react-native-svg';

const LogoutIcon = () => (
    <Svg width={28} height={28} viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}>
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <Polyline points="16 17 21 12 16 7" />
        <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
);

export const LogoutButton = () => {
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false);
    const { setAuthState } = useAuth();

    const handlePress = async () => {
        try {
            ReactGA.event({
                category: 'User Interaction',
                action: 'Click',
                label: 'Logout Button'
            });

            setIsLoading(true);

            // ログアウトリクエストを実行
            await RequestLogout();
            setAuthState(false);
            setIsLoading(false);

            router.replace("/");
        } catch (error) {
            console.error('Logout failed:', error);
            router.replace("/error")
        }
    };

    return (
        <>
            {isLoading ?
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={theme.tertiary} />
                </View> :
                <TouchableOpacity
                    onPress={handlePress}
                >
                    <LogoutIcon />
                </TouchableOpacity>
            }
        </>
    )
}

const styles = StyleSheet.create({
    indicator: {
        justifyContent: 'center',
        marginRight: '10px'
    },
});