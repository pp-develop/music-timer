import React, { useState } from "react";
import { Switch } from '@rneui/themed';
import { Text } from "@rneui/base";
import { ResponseContext } from '../hooks/useContext';
import { View, StyleSheet } from 'react-native';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';

export const SwitchFavoriteArtists = (prop: any) => {
    const theme = useTheme()
    const context = React.useContext(ResponseContext);
    const [checked, setChecked] = useState(false);

    const toggleSwitch = () => {
        context.isFavoriteArtists = !checked
        setChecked(!checked);
    };

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
                    paddingBottom: 10,
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
                <Switch
                    value={checked}
                    onValueChange={toggleSwitch}
                    disabled={true}
                />
                <Text style={styles.desc}>{t('form.gest.includeFavoriteArtists.desc')}</Text>
            </View>

        </>
    );
}


const styles = StyleSheet.create({
    desc: {
        paddingTop: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        color: "red"
    }
});