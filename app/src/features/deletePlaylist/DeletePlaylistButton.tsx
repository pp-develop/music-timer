import React, { useState } from 'react';
import { Button } from "@rneui/base";
import { Text, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import { DeletePlaylistDialog } from "./DeletePlaylistDialog"



export const DeletePlaylist = (props: any) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [httpStatus, setHttpStatus] = useState(0);

    const changeDialogVisible = (isVisible: any) => {
        setDialogVisible(isVisible)
    }

    return (
        <>
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

                    maxWidth: 1280,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                titleStyle={{ fontWeight: 'bold' }}
                onPress={onPress}
            />
            <DeletePlaylistDialog
                visible={dialogVisible}
                isLoading={isLoading}
                httpStatus={httpStatus}
                changeVisible={changeDialogVisible}
            />
        </>
    );

    function onPress(){
        setDialogVisible(true)
        setIsLoading(true)
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
                setHttpStatus(response.status)
            })
            .catch(function (error) {
                console.error(error);
                setHttpStatus(error.status)
            })
            .finally(function () {
                setIsLoading(false)
            });
    };
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