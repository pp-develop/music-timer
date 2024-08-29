import React, { useState, useContext, useEffect } from 'react';
import { Button } from "@rneui/base";
import { StyleSheet } from 'react-native';
import { deletePlaylist } from '../api/DeletePlaylist';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import PlaylistContext from '../hooks/useContext';
import { getPlaylist } from '../api/GetPlaylist';
import ReactGA from 'react-ga4';

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
                } else if (playlistData.httpStatus == 200 && playlistData.playlistIDs?.length > 0) {
                    setShowDeleteButton(true)
                }
            } catch (err) {
                setShowDeleteButton(true)
            }
        }

        fetchPlaylist();
    }, []);

    const handlePress = async () => {
        ReactGA.event({
            category: 'User Interaction',
            action: 'Click',
            label: 'Delete Playlist Button'
        });

        setLoading(true);
        try {
            await toast.promise(deletePlaylist(), {
                loading: t('toast.playlistDeleting'),
                success: () => t('toast.playlistDeleted'),
                error: () => t('toast.playlistDeleteError'),
            },
                // {
                //     style: {
                //         minWidth: '250px',
                //     },
                //     success: {
                //         duration: 5000,
                //         icon: '🔥',
                //     }
                // }
            );
            setShowDeleteButton(false)
        } catch (error) {
            setShowDeleteButton(true)
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: '',
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />

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
                    onPress={handlePress}
                    disabled={loading}  // 通信中はボタンを無効化
                />
            )}
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
