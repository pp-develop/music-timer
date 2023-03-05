import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, View } from 'react-native';
import { authz, auth, logout as Logout } from '../api/auth'
import { useLocalStorage } from "../../../hooks/useLocalStorage";

export const OAuthButton = () => {
    const [localStorage, setLocalStorage] = useLocalStorage("isLogin", "");
    const [isLogin, setIsLogin] = useState(localStorage != "")
    const [isLoading, setIsLoading] = useState(false);

    const login = async () => {
        setIsLoading(true)
        const response = await authz()

        if (response.httpStatus == 200) {
            window.location.href = response.authzUrl;
        } else {
            alert("サーバーエラー")
            setIsLoading(false)
        }
    };

    const logout = async () => {
        setIsLoading(true)
        const response = await Logout()

        if (response.httpStatus == 200) {
            setLocalStorage("")
            setIsLogin(false)
            setIsLoading(false)
        } else {
            alert("サーバーエラー")
            setIsLoading(false)
        }
    };

    useEffect(() => {
        (async () => {
            const response = await auth();

            if (response.httpStatus == 200) {
                setLocalStorage("isLogin")
                setIsLogin(true)
            } else {
                setLocalStorage("")
                setIsLogin(false)
            }
        })()
    }, [])

    if (isLogin) {
        return (
            <Pressable style={styles.button} onPress={logout}>
                {isLoading ?
                    <View style={styles.indicator}>
                        <ActivityIndicator size="large" color="white" />
                    </View> :
                    <Text style={styles.text}>Logout</Text>
                }
            </Pressable>
        )
    } else {
        return (
            <Pressable style={styles.button} onPress={login}>
                {isLoading ?
                    <View style={styles.indicator}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                    :
                    <Text style={styles.text}>Login</Text>
                }
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        width: 150,
        height: 45
    },
    text: {
        fontSize: 32,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    indicator: {
        justifyContent: 'center',
    },
});