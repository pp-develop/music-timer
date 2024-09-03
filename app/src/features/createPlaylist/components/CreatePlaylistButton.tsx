import React from "react";
import { Button } from "@rneui/base";
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';

export const CreatePlaylistButton = ({ createPlaylist }) => {
    const theme = useTheme();
    
    const handlePress = () => {
        createPlaylist();
    };

    return (
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
                marginTop: 15,
                marginBottom: 15,
            }}
            titleStyle={{
                fontWeight: 'bold',
                fontSize: 18,
                color: 'white',
            }}
            onPress={handlePress}
        />
    );
};
