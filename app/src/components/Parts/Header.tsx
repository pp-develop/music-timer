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
import { useAuth } from "../../../src/hooks/useAuth";
import { Svg, Path, Line, Polyline } from 'react-native-svg';
import { MAX_INPUT_WIDTH } from '../../config';
const { width } = Dimensions.get('window');

const LogoutIcon = () => (
    <Svg width={28} height={28} viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}>
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <Polyline points="16 17 21 12 16 7" />
        <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
);

export const Header = () => {
    const pathname = usePathname();
    if (pathname == '/error') {
        return
    }

    const { loading, isAuthenticated } = useAuth();

    const handleTitlePress = () => {
        router.replace('/');
    };

    return (
        <>
            {!loading && (
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={pathname.startsWith('/playlist') ? undefined : () => handleTitlePress()}
                    >
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                            ellipsizeMode="tail" >
                            {t('header.title')}
                        </Text>
                    </TouchableOpacity>
                    {
                        isAuthenticated ? (
                            <LogoutButton />
                        ) : (
                            <></>
                        )}
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
        fontSize: Math.min(28, width * 0.07), // レスポンシブなフォントサイズ
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        maxWidth: MAX_INPUT_WIDTH - 80,
    },

});