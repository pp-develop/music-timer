import React, { useState } from 'react';
import { Button } from "@rneui/base";
import { StyleSheet } from 'react-native';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { DeletePlaylistDialog } from "./DeletePlaylistDialog"
import { deletePlaylist } from '../api/DeletePlaylist';

export const DeletePlaylist = (props: any) => {
    const { toggle, open, isOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [httpStatus, setHttpStatus] = useState(0);

    const onclick = async () => {
        setIsLoading(true)
        open()

        const response = await deletePlaylist()

        setHttpStatus(response.httpStatus)
        setIsLoading(false)
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

                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                titleStyle={{ fontWeight: 'bold' }}
                onPress={onclick}
            />
            <DeletePlaylistDialog
                visible={isOpen}
                isLoading={isLoading}
                httpStatus={httpStatus}
                changeVisible={toggle}
            />
        </>
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