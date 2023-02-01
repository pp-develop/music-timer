import React from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { ResponseContext } from './SpecifyForm';

export const PlaylistDialog = (prop: any) => {
  const responseCreatePlayliset = React.useContext(ResponseContext);
  let response = responseCreatePlayliset;

  const toggleDialog = () => {
    prop.changeVisible(!prop.visible)
  };

  return (
    <View>
      <Dialog isVisible={prop.visible} onBackdropPress={toggleDialog}>
        {prop.isLoading ?
          <Dialog.Loading />
          :
          <div>
            <iframe style={styles.playlist} src={'https://open.spotify.com/embed/playlist/' + response.playlistId + "?utm_source=generator"} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        }
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    width: 220,
    margin: 20,
  },
  buttonContainer: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlist: {
    borderRadius: 12
  },
});
