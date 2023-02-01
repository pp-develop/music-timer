import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import axios from 'axios';
// import { Input, Icon } from '@rneui/themed';
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog"
import { CreatePlaylistButton } from "./CreatePlaylistButton"

export const SpecifyForm = () => {

    const [dialogVisible, setDialogVisible] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [httpStatus, setHttpStatus] = useState(0);

    const changeDialogVisible = (isVisible: any) => {
        setDialogVisible(isVisible)
    }

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
            // value={number}
            />
            <CreatePlaylistButton onclick={createPlaylist} />
            <CreatePlaylistDialog
                visible={dialogVisible}
                isLoading={isLoading}
                httpStatus={httpStatus}
                changeVisible={changeDialogVisible}
            />
        </>
    );

    function createPlaylist() {
        setDialogVisible(true)
        setisLoading(true)
        axios.post('http://localhost:8080/playlist',
            {
                'minute': 25
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    "Access-Control-Allow-Credentials": 'true',
                },
                withCredentials: true,
            },
        )
            .then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    spotifyResponse.createPlaylist.playlistId = response.data
                    setHttpStatus(response.status)
                }
            })
            .catch(function (error) {
                console.error(error);
                setHttpStatus(error.status)
            })
            .finally(function () {
                setisLoading(false)
            });
    };
};

const spotifyResponse = {
    createPlaylist: {
        playlistId: '',
    },
};

export const ResponseContext = React.createContext(
    spotifyResponse.createPlaylist
);

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