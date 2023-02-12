import React, { useState } from "react";
import { Switch } from '@rneui/themed';
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