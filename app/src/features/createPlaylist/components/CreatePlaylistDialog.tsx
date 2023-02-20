import React, { useState, useEffect } from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ResponseContext } from '../hooks/useContext';
import { Text } from "@rneui/base";
import { Spotify } from 'react-spotify-embed';

let { width, height, scale } = Dimensions.get('window');
if (width > 800) {
  width = width * 0.6;
} else {
  width = width * 0.8;
}

export const CreatePlaylistDialog = (prop: any) => {
  const context = React.useContext(ResponseContext);
  const [rel, setRel] = useState("")

  const getOembed = () => {
    return "https://open.spotify.com/playlist/" + context.playlistId
  }

  const toggleDialog = () => {
    prop.toggle()
  };

  useEffect(
    () => {
      console.log(prop.playlistId);

      let timeoutId : NodeJS.Timeout
      if (prop.playlistId != "") {
        timeoutId = setTimeout(() => {
          // setRel("test")
        }, 3000)
      }
      return () => {
        clearTimeout(timeoutId)
      }
    },
    [prop.isLoading]
  );

  return (
    <View>
      <Dialog isVisible={prop.isOpen} onBackdropPress={toggleDialog} overlayStyle={styles.dialog}>
        {prop.isLoading ?
          <Dialog.Loading />
          :
          prop.httpStatus == 201 ?
            <iframe style={styles.playlist} src={'https://open.spotify.com/embed/playlist/' + prop.playlistId + "?utm_source=generator"} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" rel={rel != "" ? "preload" : ""}></iframe>
            :
            prop.httpStatus == 404 ?
              <Text
                h2
                h2Style={styles.textFont}
                style={styles.text}
              >
                The playlist could not be created.<br />
                Please try again
              </Text>
              :
              <div>
                <Text
                  h2
                  h2Style={styles.textFont}
                  style={styles.text}
                >
                  Server error.<br />
                  Please try again later
                </Text>
              </div>
        }
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  dialog: {
    alignItems: 'center',
    borderRadius: 12,
    width: width,
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textFont: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  playlist: {
    borderRadius: 12,
  }
});
