import React, { useState } from "react";
import { Switch } from '@rneui/themed';
import { Text } from "@rneui/base";
import { ResponseContext } from '../hooks/useContext';
import { View, StyleSheet } from 'react-native';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../assets/ThemeContext';

export const SwitchFavoriteArtists = (prop: any) => {
    const theme = useTheme()
    const context = React.useContext(ResponseContext);
    const [checked, setChecked] = useState(false);

    const toggleSwitch = () => {
        context.isFavoriteArtists = !checked
        setChecked(!checked);
    };

    return (
        <View style={{
            backgroundColor: theme.primaryColor,
            maxWidth: 500,
            marginLeft: 20,
            marginRight: 20,
        }}>
            <Text
                h3
                h3Style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: theme.tertiary,
                }}
                style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
            >
                {t('form.includeFavoriteArtists')}
            </Text>
            <Switch
                value={checked}
                onValueChange={toggleSwitch}
            />
        </View>
    );
}
