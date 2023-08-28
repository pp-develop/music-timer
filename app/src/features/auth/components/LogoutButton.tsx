import React, { useState, useContext } from 'react';
import { Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { logout as Logout } from '../api/auth'
import { setLogoutStatus } from "../../../hooks/useLoginStatus";
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../assets/ThemeContext';
import { AuthContext } from "../../../hooks/useContext";

export const LogoutButton = () => {
    const theme = useTheme()
    const { isLogin, logout } = useContext(AuthContext);

    if (!isLogin) {
        return null;  // ログインしていない場合は何も表示しない
    }

    const [isLoading, setIsLoading] = useState(false);

    const requestLogout = async () => {
        setIsLoading(true)
        const response = await Logout()

        if (response.httpStatus == 200) {
            logout()
            setLogoutStatus()
            setIsLoading(false)
        } else {
            alert("サーバーエラー")
            logout()
            setIsLoading(false)
        }
    };

    return (
        <>
            {isLoading ?
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color="white" />
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
    },
});