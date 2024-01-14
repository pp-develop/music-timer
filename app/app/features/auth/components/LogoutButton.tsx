import React, { useState, useContext } from 'react';
import { Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { logout as Logout } from '../api/auth'
import { setLogoutStatus } from "../../../hooks/useLoginStatus";
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../assets/ThemeContext';
import { AuthContext } from "../../../hooks/useContext";
import { Link, router } from 'expo-router';

export const LogoutButton = () => {
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false);
    const { isLogin, logout } = useContext(AuthContext);

    if (!isLogin) {
        return null;  // ログインしていない場合は何も表示しない
    }

    const requestLogout = async () => {
        setIsLoading(true)
        const response = await Logout()

        if (response.httpStatus == 200) {
            logout()
            setLogoutStatus()
            setIsLoading(false)
        } else {
            logout()
            setIsLoading(false)
        }
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