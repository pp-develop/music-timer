import React, { useState } from "react";
import { Button } from "@rneui/base";
import { CreatePlaylist } from "../api/createPlaylist"
import { CreatePlaylistWithFavoriteArtists } from "../api/createPlaylistWithFavoriteArtists"
import { CreatePlaylistDialog } from "./CreatePlaylistDialog"
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ResponseContext } from '../hooks/useContext';

export const CreatePlaylistButton = (prop: any) => {
    const { toggle, open, isOpen } = useDisclosure();
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const context = React.useContext(ResponseContext);

    const createPlaylist = async (minute: string) => {
        open()

        const response = await CreatePlaylist(minute)
        setPlaylistId(response.playlistId)
        setHttpStatus(response.httpStatus)
    }

    const createPlaylistWithFavoriteArtists = async (minute: string) => {
        
        open()
        const response = await CreatePlaylistWithFavoriteArtists(minute)
        setPlaylistId(response.playlistId)
        setHttpStatus(response.httpStatus)
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
                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                titleStyle={{ fontWeight: 'bold' }}
                onPress={() => context.isFavoriteArtists
                    ? createPlaylistWithFavoriteArtists(prop.minute) : createPlaylist(prop.minute)}
            />
            <CreatePlaylistDialog
                isOpen={isOpen}
                httpStatus={httpStatus}
                toggle={toggle}
                playlistId={playlistId}
            />
        </>
    );
}

