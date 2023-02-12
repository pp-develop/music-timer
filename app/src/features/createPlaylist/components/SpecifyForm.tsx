import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CreatePlaylistButton } from "./CreatePlaylistButton"
import { SwitchFavoriteArtists } from "./SwitchFavoriteArtists"

export const SpecifyForm = () => {
    const [minute, setMinute] = useState("");

    return (
        <>
            <Input
                keyboardType='numeric'
                containerStyle={{}}
                disabledInputStyle={{
                    backgroundColor: 'black',
                }}
                inputContainerStyle={{
                    backgroundColor: "white",
                    maxWidth: 1280,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
                errorMessage="Oops! that's not correct."
                errorStyle={{
                    backgroundColor: "white",
                    maxWidth: 1280,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
                errorProps={{}}
                inputStyle={{}}
                label="Specify Time"
                labelStyle={{
                    backgroundColor: "white",
                    maxWidth: 1280,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}
                labelProps={{}}
                leftIcon={<Icon name="clock-outline" size={20} />}
                leftIconContainerStyle={{}}
                rightIcon={<Icon name="close" size={20} />}
                rightIconContainerStyle={{}}
                placeholder="Enter Minute"
                onChangeText={setMinute}
                value={minute}
            />
            <SwitchFavoriteArtists />
            <CreatePlaylistButton minute={minute} />
        </>
    );    
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});