import React from "react";
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