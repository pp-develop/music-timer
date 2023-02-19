import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Pressable, Image } from 'react-native';
import { authz, auth, logout as Logout } from '../api/auth'
import { Response } from '../types/index';
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const image = {uri: 'https://reactjs.org/logo-og.png'};

export const OAuthButton = () => {
    const [localStorage, setLocalStorage] = useLocalStorage("isLogin", "");
    const [isLogin, setIsLogin] = useState(localStorage != "")

    const login = async () => {
        const response = await authz()

        if (response.httpStatus == 200) {
            window.location.href = response.authzUrl;
        } else {
            alert("サーバーエラー")
        }
    };

    const logout = async () => {
        const response = await Logout()

        if (response.httpStatus == 200) {
            setLocalStorage("")
            setIsLogin(false)
        } else {
            alert("サーバーエラー")
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
                <Text style={styles.text}>Logout</Text>
            </Pressable>
        )
    } else {
        return (
            <Pressable style={styles.button} onPress={login}>
                <Text style={styles.text}>Login</Text>
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
    },
    text: {
        fontSize: 32,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
});