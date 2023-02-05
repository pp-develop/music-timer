import React, { useState } from "react";
import { Button } from "@rneui/base";
import { createPlaylist } from "../api/createPlaylist"
import { CreatePlaylistDialog } from "./CreatePlaylistDialog"
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ResponseContext } from '../hooks/useContext';

export const CreatePlaylistButton = (prop: any) => {
    const { toggle, open, isOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [httpStatus, setHttpStatus] = useState(0);
    const context = React.useContext(ResponseContext);

    const onclick = async (minute: string) => {
        setIsLoading(true)
        open()

        const response = await createPlaylist(minute)
        if (response.httpStatus = 201) {
            context.playlistId = response.playlistId
        }

        setHttpStatus(response.httpStatus)
        setIsLoading(false)
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
                isOpen={isOpen}
                isLoading={isLoading}
                httpStatus={httpStatus}
                toggle={toggle}
            />
        </>
    );
}
