import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { auth } from '../../src/features/auth/api/auth'
import { GestForm } from "../../src/features/createPlaylist";
import { DeletePlaylist } from "../../src/features/deletePlaylist/components/DeletePlaylistButton";
import { setLoginStatus, setLogoutStatus } from "../../src/hooks/useLoginStatus";
import { AuthContext } from "../../src/hooks/useContext";
import { useTheme } from '../../src/config/ThemeContext';
import { router } from 'expo-router';

export default function Layout() {
    const theme = useTheme()

    return (
        <>
            <GestForm />
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