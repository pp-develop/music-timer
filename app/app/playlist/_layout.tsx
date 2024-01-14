import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { auth } from '../features/auth/api/auth'
import { Form } from "../features/createPlaylist";
import { DeletePlaylist } from "../features/deletePlaylist/components/DeletePlaylistButton";
import { setLoginStatus, setLogoutStatus } from "../hooks/useLoginStatus";
import { AuthContext } from "../hooks/useContext";
import { useTheme } from '../assets/ThemeContext';
import { Link, router } from 'expo-router';

export default function Layout() {
    const theme = useTheme()
    const { isLogin, login, logout } = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await auth();
                if (response.httpStatus === 200) {
                    setLoginStatus();
                    login();
                } else {
                    setLogoutStatus();
                    logout();
                    router.replace('/');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    return (
        <>
            {isLoading && (
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={theme.tertiary} />
                </View>
            )}
            {!isLoading && (
                <>
                    {isLogin && (
                        <>
                            <Form />
                            <DeletePlaylist />
                        </>
                    )}
                </>
            )}
        </>
    );
}


const styles = StyleSheet.create({
    indicator: {
        marginTop: '100px',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});