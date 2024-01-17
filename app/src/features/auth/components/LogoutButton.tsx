import React, { useState } from 'react';
import { Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { logout as RequestLogout } from '../api/auth'
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import { useAuth } from "../../../../src/hooks/useAuth";
import { router } from 'expo-router';

export const LogoutButton = () => {
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, setAuthState } = useAuth();

    if (!isAuthenticated) {
        return null;  // ログインしていない場合は何も表示しない
    }

    const requestLogout = async () => {
        setIsLoading(true)
        await RequestLogout()
        setAuthState(false)
        setIsLoading(false)
        router.replace("/")
    };

    return (
        <>
            {isLoading ?
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={theme.tertiary} />
                </View> :
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.tertiary,
                }} onPress={requestLogout}>{t('auth.logout')}</Text>
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