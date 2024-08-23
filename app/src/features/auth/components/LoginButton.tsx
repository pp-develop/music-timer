import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, View, Image } from 'react-native';
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
                // TODO::　ドメイン統一後に削除
                if (!sessionStorage.getItem('pressAuth')) {
                    sessionStorage.setItem('pressAuth', 'true');
                }
                window.location.href = response.authzUrl;
            }
        } catch (error) {
            setAuthState(false)
            console.error('Login failed:', error);
            router.replace("/error")
        } finally {
            setIsLoading(false)
        }
    };
    return (
        <Pressable style={styles.button} onPress={handlePress}>
            {isLoading ?
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color="white" />
                </View>
                :
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image
                        source={require('../../../../assets/images/spotify-icon-green.png')}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                    />
                    <Text style={styles.text}>{t('auth.login')}</Text>
                </View>
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 28,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: 'black',
        marginTop: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    indicator: {
        justifyContent: 'center',
    },
});