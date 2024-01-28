import React from "react";
import { Button } from "@rneui/base";
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import { ResponseContext } from '../hooks/useContext';

export const CreatePlaylistButton = ({ createPlaylist, createPlaylistWithSpecifyArtists, minute }) => {
    const theme = useTheme()
    const context = React.useContext(ResponseContext);

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
                onPress={() => {
                    if (context.followedArtistIds && context.followedArtistIds.length > 0) {
                        createPlaylistWithSpecifyArtists(minute)
                    } else {
                        createPlaylist(minute)
                    }
                }}
            />
        </>
    );
}

