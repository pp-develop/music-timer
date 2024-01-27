import React, { useState } from "react";
import { Button } from "@rneui/base";
import { CreatePlaylist } from "../api/createPlaylist"
import { CreatePlaylistWithSpecifyArtists } from "../api/createPlaylistWithSpecifyArtists"
import { CreatePlaylistDialog } from "./CreatePlaylistDialog"
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ResponseContext } from '../hooks/useContext';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';

export const CreatePlaylistButton = (prop: any) => {
    const theme = useTheme()
    const { toggle, open, isOpen } = useDisclosure();
    const [isLoading, setIsLoding] = useState(true);
    const [httpStatus, setHttpStatus] = useState(0);
    const [playlistId, setPlaylistId] = useState("");
    const context = React.useContext(ResponseContext);

    const createPlaylist = async (minute: string) => {
        if (!prop.validate()) {
            return
        }
        open()
        setIsLoding(true)

        const response = await CreatePlaylist(minute)
        if (response.httpStatus == 201) {
            setPlaylistId(response.playlistId)
            // 本番環境だと、遅延を発生させないとコンテンツが正常に読み込めないため
            let timeoutId: NodeJS.Timeout
            timeoutId = setTimeout(() => {
                setIsLoding(false)
            }, 2000)
        } else {
            setIsLoding(false)
        }
        setHttpStatus(response.httpStatus)
    }

    const createPlaylistWithSpecifyArtists = async (minute: string) => {
        if (!prop.validate()) {
            return
        }
        open()
        setIsLoding(true)

        const artistIds = context.followedArtistIds.map((item: any) => (item));
        const response = await CreatePlaylistWithSpecifyArtists(minute, artistIds)
        if (response.httpStatus == 201) {
            setPlaylistId(response.playlistId)
            // 本番環境だと、遅延を発生させないとコンテンツが正常に読み込めないため
            let timeoutId: NodeJS.Timeout
            timeoutId = setTimeout(() => {
                setIsLoding(false)
            }, 2000)
        } else {
            setIsLoding(false)
        }
        setHttpStatus(response.httpStatus)
    }

    return (
        <>
            <Button
                title={t('form.createPlaylist')}
                buttonStyle={{
                    backgroundColor: theme.tertiary,
                    borderWidth: 2,
                    borderColor: theme.primaryColor,
                    borderRadius: 30,
                    paddingTop: 15,
                    paddingBottom: 15,
                    paddingRight: 5,
                    paddingLeft: 5,
                }}
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 30,
                    marginBottom: 15,
                }}
                titleStyle={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: 'white'
                }}
                onPress={
                    () => {
                        if (context.followedArtistIds && context.followedArtistIds.length > 0) {
                            createPlaylistWithSpecifyArtists(prop.minute)
                        } else {
                            createPlaylist(prop.minute)
                        }
                    }
                }
            />
            <CreatePlaylistDialog
                isOpen={isOpen}
                httpStatus={httpStatus}
                toggle={toggle}
                playlistId={playlistId}
                isLoading={isLoading}
            />
        </>
    );
}

