import React, { useState, useEffect } from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { Dimensions, StyleSheet, Pressable, View, Image } from 'react-native';
import { Text } from "@rneui/base";
import { SpotifyEmbed } from '../../../components/SpotifyEmbed';
import { t } from '../../../locales/i18n';
import { useTheme } from '../../../config/ThemeContext';

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

  const openSpotify = () => {
    window.open("https://open.spotify.com/playlist/" + prop.playlistId + '?go=1', '_blank');
  };

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
            <Dialog.Loading
              loadingProps={{
                color: 'black',
              }}
            />
          </>
          :
          prop.httpStatus == 201 ?
            <>
              <SpotifyEmbed
                link={"https://open.spotify.com/playlist/" + prop.playlistId}
                width={width * 0.8}
              />
              <Pressable style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 30,
                elevation: 3,
                backgroundColor: theme.tertiary,
                marginTop: 10,
                marginLeft: 'auto',
                marginRight: 'auto'
              }} onPress={openSpotify}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Image
                    source={require('../../../../assets/images/spotify-icon.png')}
                    style={{ width: 25, height: 25, marginRight: 10 }}
                  />
                  <Text style={styles.buttonText}>{t('dialog.createPlaylist.open')}</Text>
                </View>
              </Pressable>
              <Dialog.Actions>
                <Dialog.Button title={t('dialog.createPlaylist.close')} onPress={handleBackdropPress} />
              </Dialog.Actions>
            </>
            :
            prop.httpStatus == 404 ?
              <>
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
                <Dialog.Actions>
                  <Dialog.Button title="閉じる" onPress={handleBackdropPress} />
                </Dialog.Actions>
              </>
              :
              <>
                <Text
                  h2
                  h2Style={{
                    fontSize: 20,
                    color: theme.tertiary
                  }} style={styles.text}
                >
                  {t('dialog.createPlaylist.server.error')}
                </Text>
                <Dialog.Actions>
                  <Dialog.Button title="閉じる" onPress={handleBackdropPress} />
                </Dialog.Actions>
              </>
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
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
