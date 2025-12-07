import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { LogoutButton } from "../../features/spotify/auth";
import { t } from '../../locales/i18n';
import { router, usePathname } from 'expo-router';
import { useSpotifyAuth } from "../../hooks/useSpotifyAuth";
import { MAX_INPUT_WIDTH } from '../../config';
const { width } = Dimensions.get('window');

export const SpotifyHeader = () => {
    const pathname = usePathname();
    if (pathname == '/error') {
        return null;
    }

    const { loading, isAuthenticated } = useSpotifyAuth();

    const handleTitlePress = () => {
        router.replace('/');
    };

    return (
        <>
            {!loading && (
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={pathname.startsWith('/spotify') ? undefined : () => handleTitlePress()}
                    >
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                            ellipsizeMode="tail" >
                            {t('header.title')}
                        </Text>
                    </TouchableOpacity>
                    {isAuthenticated && <LogoutButton />}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        maxWidth: MAX_INPUT_WIDTH,
        alignSelf: 'stretch',
    },
    title: {
        fontSize: Math.min(28, width * 0.07),
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        maxWidth: MAX_INPUT_WIDTH - 80,
    },
});
