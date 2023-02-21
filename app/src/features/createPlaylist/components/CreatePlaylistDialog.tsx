import React, { useState, useEffect } from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from "@rneui/base";
import { Spotify } from 'react-spotify-embed';

let { width, height, scale } = Dimensions.get('window');
if (width > 800) {
  width = width * 0.6;
} else {
  width = width * 0.8;
}

export const CreatePlaylistDialog = (prop: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [src, setSrc] = useState("https://open.spotify.com/playlist/")

  const toggleDialog = () => {
    prop.toggle()
  };

  useEffect(
    () => {
      if (prop.isOpen) {
        setIsLoading(true)
      }
    },
    [prop.isOpen]
  );

  useEffect(
    () => {
      if (prop.isOpen) {
        setSrc("https://open.spotify.com/playlist/" + prop.playlistId)

        let timeoutId: NodeJS.Timeout
        timeoutId = setTimeout(() => {
          setIsLoading(false)
        }, 2000)

        return () => {
          clearTimeout(timeoutId)
        }
      }

    },
    [prop.playlistId]
  );

  return (
    <View>
      <Dialog isVisible={prop.isOpen} onBackdropPress={toggleDialog} overlayStyle={styles.dialog}>
        {isLoading ?
          <Dialog.Loading />
          :
          prop.httpStatus == 201 ?
            <Spotify
              link={src}
              width={width * 0.8}
            />
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
  }
});
