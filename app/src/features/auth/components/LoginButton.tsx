import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Linking,
    Platform
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { authz } from '../api/auth'
import { t } from '../../../locales/i18n';
import { useAuth } from "../../../hooks/useAuth";
import ReactGA from 'react-ga4';
import { router } from 'expo-router';

export const LoginButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { setAuthState } = useAuth();


    const handlePress = async () => {
        try {
            ReactGA.event({
                category: 'User Interaction',
                action: 'Click',
                label: 'Login Button'
            });

            setIsLoading(true)
            const response = await authz()

            if (response.httpStatus == 200) {
                // プラットフォーム対応のURL遷移
                if (Platform.OS === 'web') {
                    window.location.href = response.authzUrl;
                } else {
                    await Linking.openURL(response.authzUrl);
                }
            }
        } catch (error) {
            setAuthState(false)
            console.error('Login failed:', error);
            router.replace("/error")
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 10000);
        }
    };
    return (

        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handlePress}
        >
            {isLoading ?
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color="white" />
                </View>
                :
                <>
                    <Svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor">
                        <Path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </Svg>
                    <Text style={styles.buttonText}>{t('auth.login')}</Text>
                </>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: '#1DB954',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        transform: [{ scale: 1 }],
        transition: 'transform 0.3s ease',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    indicator: {
        justifyContent: 'center',
    },
});