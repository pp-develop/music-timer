import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Linking,
    Platform,
    Image
} from 'react-native';
import { authz } from '../api/auth'
import { t } from '../../../../locales/i18n';
import ReactGA from 'react-ga4';

export const LoginButton = () => {
    const [isLoading, setIsLoading] = useState(false);


    const handlePress = async () => {
        try {
            ReactGA.event({
                category: 'User Interaction',
                action: 'Click',
                label: 'SoundCloud Login Button'
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
        } catch (error: any) {
            console.error('SoundCloud login failed:', error);
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
                    <Image
                        source={require('../../../../../assets/images/soundcloud-icon.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>{t('auth.login.soundcloud')}</Text>
                </>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: '#FF5500',
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
    icon: {
        width: 32,
        height: 32,
    },
});
