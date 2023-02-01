import React from 'react';
import { Button } from "@rneui/base";
import { Text, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';

const onPress = () => {
    axios.delete('http://localhost:8080/playlist', {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            "Access-Control-Allow-Credentials": 'true',
        },
        withCredentials: true,
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
};

export const DeletePlaylist = (props: any) => {
    const { title = 'Delete' } = props;
    return (
        <Button
            title="Delete Playlist"
            buttonStyle={{
                backgroundColor: 'black',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
            }}
            containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
            }}
            titleStyle={{ fontWeight: 'bold' }}
            onPress={onPress}
        />
    );
}

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