import React, { useContext, useState, useEffect } from "react";
import { Text, StyleSheet, Pressable, ActivityIndicator, View } from 'react-native';
import { auth } from '../src/features/auth/api/auth'
import { Description } from "../src/components/Parts/Description";
import { LoginButton } from "../src/features/auth";
import { AuthContext } from "../src/hooks/useContext";
import { useTheme } from '../src/config/ThemeContext';
import { router } from 'expo-router';
import { t } from '../src/locales/i18n';
import TextLink from 'react-native-text-link';

export default function Page() {
    const theme = useTheme()
    const { isLogin, login, logout } = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await auth();
                if (response.httpStatus === 200) {
                    login();
                    router.push('/playlist');
                } else {
                    logout();
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
                    {!isLogin && (
                        <>
                            <Description />
                            <Pressable style={styles.button} onPress={() => router.push("/gest-playlist")}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={styles.text}>{t('auth.gest')}</Text>
                                </View>
                            </Pressable>
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