import React, { useState, useContext, useEffect } from 'react';
import { Button } from "@rneui/base";
import { StyleSheet, View } from 'react-native';
import { deletePlaylist } from '../api/DeletePlaylist';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import Toast from 'react-native-toast-message';
import PlaylistContext from '../hooks/useContext';
import { getPlaylist } from '../api/GetPlaylist';

export const DeletePlaylist = (props: any) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const { showDeleteButton, setShowDeleteButton } = useContext(PlaylistContext);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const playlistData = await getPlaylist();
                if (playlistData.httpStatus == 200 && !playlistData.playlistIDs) {
                    setShowDeleteButton(false)
                } else {
                    setShowDeleteButton(true)
                }
            } catch (err) {
                setShowDeleteButton(true)
            }
        }

        fetchPlaylist();
    }, []);

    const notifi = async () => {
        setLoading(true);
        try {
            await deletePlaylist();
            Toast.show({
                type: 'success',
                position: 'top',
                text1: t('toast.playlistDeleted'),
                visibilityTime: 3000,
            });
            setShowDeleteButton(false)
        } catch (error) {
            setShowDeleteButton(true)
            Toast.show({
                type: 'error',
                position: 'top',
                text1: t('toast.playlistDeleteError'),
                visibilityTime: 3000,
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            {showDeleteButton && (
                <Button
                    title={t('form.deletePlaylist')}
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
                        marginTop: 10,
                        maxWidth: 1000,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                    titleStyle={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: 'white'
                    }}
                    onPress={notifi}
                    disabled={loading}  // 通信中はボタンを無効化
                />
            )}
        </View>
    );
}
