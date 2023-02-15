import React, { useState } from "react";
import { Switch } from '@rneui/themed';
import { Text } from "@rneui/base";
import { ResponseContext } from '../hooks/useContext';
import { View, StyleSheet } from 'react-native';

export const SwitchFavoriteArtists = (prop: any) => {
    const context = React.useContext(ResponseContext);
    const [checked, setChecked] = useState(false);

    const toggleSwitch = () => {
        context.isFavoriteArtists = !checked
        setChecked(!checked);
    };

    return (
        <View style={styles.view}>
            <Text
                h3
                h1Style={{}}
                h2Style={{}}
                h3Style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "black",
                }}
                h4Style={{}}
                style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    maxWidth: 1280,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
            >
                Prioritize inclusion of songs from your favorite artists
            </Text>
            <Switch
                value={checked}
                onValueChange={toggleSwitch}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    view: {
        backgroundColor: "white",
        maxWidth: 1280,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
});