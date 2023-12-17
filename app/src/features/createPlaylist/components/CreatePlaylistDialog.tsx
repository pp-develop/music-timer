import React, { useState, useEffect } from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from "@rneui/base";
import { Spotify } from 'react-spotify-embed';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../assets/ThemeContext';

let { width, height, scale } = Dimensions.get('window');
if (width > 800) {
  width = width * 0.6;
} else {
  width = width * 0.8;
}

export const CreatePlaylistDialog = (prop: any) => {
  const theme = useTheme()
  const toggleDialog = () => {
    prop.toggle()
  };

  const handleBackdropPress = prop.isLoading ? () => { } : toggleDialog;

  return (
    <View>
      <Dialog
        isVisible={prop.isOpen}
        onBackdropPress={handleBackdropPress}
        overlayStyle={{
          alignItems: 'center',
          borderRadius: 12,
          width: width,
          backgroundColor: theme.primaryColor,
        }}>
        {prop.isLoading ?
          <>
            <Dialog.Loading />
            <Text
              h2
              h2Style={{
                fontSize: 20,
                color: theme.tertiary
              }}
              style={styles.text}
            >
              {t('dialog.createPlaylist.loading')}
            </Text>
          </>
          :
          prop.httpStatus == 201 ?
            <Spotify
              link={"https://open.spotify.com/playlist/" + prop.playlistId}
              width={width * 0.8}
            />
            :
            prop.httpStatus == 404 ?
              <Text
                h2
                h2Style={{
                  fontSize: 20,
                  color: theme.tertiary
                }}
                style={styles.text}
              >
                {t('dialog.createPlaylist.not.created')}
              </Text>
              :
              <Text
                h2
                h2Style={{
                  fontSize: 20,
                  color: theme.tertiary
                }} style={styles.text}
              >
                {t('dialog.createPlaylist.server.error')}
              </Text>
        }
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});
