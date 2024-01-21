import React from "react";
import { StyleSheet } from 'react-native';
import { Form } from "../../features/gestCreatePlaylist";
import { useTheme } from '../../config/ThemeContext';

export default function Layout() {
    const theme = useTheme()

    return (
        <>
            <Form />
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