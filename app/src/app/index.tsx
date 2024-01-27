import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { LoginButton } from "../features/auth";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from '../config/ThemeContext';
import { router } from 'expo-router';
import { t } from '../locales/i18n';
import { Form } from "../features/gestCreatePlaylist";
import TextLink from 'react-native-text-link';

export default function Page() {
    const theme = useTheme()
    const { loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/playlist');
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
                    {!isAuthenticated && (
                        <>
                            <Form />
                            <LoginButton />
                            <TextLink textStyle={styles.desc} textLinkStyle={styles.descLink} links={[
                                {
                                    text: t('auth.login.desc.link'),
                                    onPress: () => window.open('https://forms.gle/p4CofyS2JfVaHadw9', '_blank', 'noopener,noreferrer')
                                },
                            ]}>
                                {t('auth.login.desc')}
                            </TextLink>
                        </>
                    )}
                </>
            )}
        </>)
}

const styles = StyleSheet.create({
    indicator: {
        marginTop: '100px',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 28,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: '#6E777C',
        marginTop: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    desc: {
        paddingTop: 15,
        paddingBottom: 12,
        maxWidth: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        color: "#454C50"
    },
    descLink: {
        color: "#4d4dff"
    }
});