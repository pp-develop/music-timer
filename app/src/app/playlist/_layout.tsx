import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { Form } from "../../features/createPlaylist";
import { DeletePlaylist } from "../../features/deletePlaylist/components/DeletePlaylistButton";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from '../../config/ThemeContext';
import { router } from 'expo-router';
import { PlaylistProvider } from '../../features/deletePlaylist/hooks/useContext';

export default function Layout() {
    const theme = useTheme()
    const { loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/');
        }
    }, [loading, isAuthenticated]);

    return (
        <>
            {loading && (
                <View style={styles.indicator}>
                    <ActivityIndicator size="large" color={theme.tertiary} />
                </View>
            )}
            {!loading && (
                <>
                    {isAuthenticated && (
                        <>
                            <PlaylistProvider>
                                <Form />
                                <DeletePlaylist />
                            </PlaylistProvider>
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