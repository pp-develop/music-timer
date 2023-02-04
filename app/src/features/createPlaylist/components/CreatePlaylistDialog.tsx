import React from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { ResponseContext } from './CreatePlaylistButton';

export const CreatePlaylistDialog = (prop: any) => {
  const responseCreatePlayliset = React.useContext(ResponseContext);
  let response = responseCreatePlayliset;

  const toggleDialog = () => {
    prop.changeVisible(!prop.visible)
  };

  return (
    <View>
      <Dialog isVisible={prop.visible} onBackdropPress={toggleDialog} overlayStyle={styles.dialog}>
        {prop.isLoading ?
          <Dialog.Loading />
          :
          prop.httpStatus == 201 ?
            <div>
              <iframe style={styles.playlist} src={'https://open.spotify.com/embed/playlist/' + response.playlistId + "?utm_source=generator"} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
            :
            <div>
              error
            </div>
        }
        {/* TODO エラー時の考慮 */}
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 12,
  },
  playlist: {
    borderRadius: 12
  },
});
