import React, { useState } from "react";
import { Button } from "@rneui/base";
import { createPlaylist } from "../api/createPlaylist"
import { CreatePlaylistDialog } from "./CreatePlaylistDialog"

const spotifyResponse = {
    createPlaylist: {
        playlistId: '',
    },
};

export const ResponseContext = React.createContext(
    spotifyResponse.createPlaylist
);

export const CreatePlaylistButton = (prop: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [httpStatus, setHttpStatus] = useState(0);

    const onclick = async (minute: string) => {
        setIsOpen(true)
        setIsLoading(true)

        const response = await createPlaylist(minute)
        if (response.httpStatus = 201) {
            spotifyResponse.createPlaylist.playlistId = response.playlistId
        }

        setHttpStatus(response.httpStatus)
        setIsLoading(false)
    }

    const changeDialogVisible = (isVisible: any) => {
        setIsOpen(isVisible)
    }

    return (
        <>
            <Button
                title="Create Playlist"
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
                onPress={() => onclick(prop.minute)}
            />
            <CreatePlaylistDialog
                visible={isOpen}
                isLoading={isLoading}
                httpStatus={httpStatus}
                changeVisible={changeDialogVisible}
            />
        </>
    );
}

