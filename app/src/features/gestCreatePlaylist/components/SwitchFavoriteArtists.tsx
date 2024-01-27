import React from "react";
import { Text } from "@rneui/base";
import { View, StyleSheet } from 'react-native';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';

export const SwitchFavoriteArtists = (prop: any) => {
    const theme = useTheme()

    return (
        <>
            <Text
                h3
                h3Style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: theme.tertiary,
                }}
                style={{
                    paddingTop: 20,
                    maxWidth: 500,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                {t('form.includeFavoriteArtists')}
            </Text>
            <View style={{
                width: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
                alignItems: 'flex-end'
            }}>
                <Text style={styles.desc}>{t('form.gest.includeFavoriteArtists.desc')}</Text>
            </View>

        </>
    );
}


const styles = StyleSheet.create({
    desc: {
        paddingTop: 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        color: "red"
    }
});