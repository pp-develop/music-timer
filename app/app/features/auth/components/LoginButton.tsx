import React, { useState, useContext } from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, View, Image } from 'react-native';
import { authz } from '../api/auth'
import { t } from '../../../locales/i18n';
import { AuthContext } from "../../../hooks/useContext";

export const LoginButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login, logout } = useContext(AuthContext);


    const requestLogin = async () => {
        setIsLoading(true)
        const response = await authz()

        if (response.httpStatus == 200) {
            window.location.href = response.authzUrl;
        } else {
            setIsLoading(false)
            logout()
        }
    };
    return (
        <Pressable style={styles.button} onPress={requestLogin}>
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
                        source={require('../../../../assets/images/spotify-icon.png')}
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