import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { deletePlaylist } from '../api/DeletePlaylist';
import { t } from '../../../locales/i18n';
import toast, { Toaster } from 'react-hot-toast';
import PlaylistContext from '../hooks/useContext';
import { getPlaylist } from '../api/GetPlaylist';
import ReactGA from 'react-ga4';
import { Svg, Path, Line, Polyline } from 'react-native-svg';

const TrashIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2}>
        <Polyline points="3 6 5 6 21 6" />
        <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <Line x1="10" y1="11" x2="10" y2="17" />
        <Line x1="14" y1="11" x2="14" y2="17" />
    </Svg>
);

export const DeletePlaylist = (props: any) => {
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
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handlePress}
                    disabled={loading}  // 通信中はボタンを無効化
                >
                    <TrashIcon />
                </TouchableOpacity>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: '#DC2626',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
    },
});
