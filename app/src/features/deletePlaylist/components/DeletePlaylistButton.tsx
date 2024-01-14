import React, { useState } from 'react';
import { Button, Text } from "@rneui/base";
import { StyleSheet } from 'react-native';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { deletePlaylist } from '../api/DeletePlaylist';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';

export const DeletePlaylist = (props: any) => {
    const theme = useTheme();

    const notifi = async () => {
        toast.promise(deletePlaylist(), {
            loading: '',
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
            <Button
                title={t('form.deletePlaylist')}
                buttonStyle={{
                    backgroundColor: theme.tertiary,
                    borderWidth: 2,
                    borderColor: theme.primaryColor,
                    borderRadius: 30,
                }}
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginTop: 10,

                    maxWidth: 1000,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                titleStyle={{ fontWeight: 'bold' }}
                onPress={notifi}
            />
            <Text
                h3
                h3Style={{
                    fontSize: 14,
                    color: theme.tertiary,
                }}
                style={{
                    width: 180,
                    marginHorizontal: 50,
                    marginTop: 5,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                {t('form.deletePlaylistExplan')}
            </Text>
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