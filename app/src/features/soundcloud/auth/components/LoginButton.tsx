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
                    <Svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor">
                        <Path d="M7.803 5.731c.589 0 1.119.236 1.508.625.391.39.627.918.627 1.508 0 .59-.236 1.117-.627 1.508-.39.39-.919.625-1.508.625-.589 0-1.119-.236-1.508-.625-.391-.391-.627-.918-.627-1.508 0-.59.236-1.117.627-1.508.39-.39.919-.625 1.508-.625zm-5.803 8.058c0-2.177 1.764-3.943 3.941-3.943s3.941 1.766 3.941 3.943c0 2.178-1.764 3.943-3.941 3.943s-3.941-1.765-3.941-3.943zm15.055-.005c0-1.215.984-2.199 2.199-2.199s2.199.984 2.199 2.199c0 1.214-.984 2.199-2.199 2.199s-2.199-.985-2.199-2.199zm-3.396 0c0-.806.652-1.458 1.458-1.458s1.458.652 1.458 1.458c0 .805-.652 1.458-1.458 1.458s-1.458-.653-1.458-1.458zm-11.455-5.277c0-.533.433-.966.966-.966s.966.433.966.966c0 .533-.433.966-.966.966s-.966-.433-.966-.966z" />
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
});
