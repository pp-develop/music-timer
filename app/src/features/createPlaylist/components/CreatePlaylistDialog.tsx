import React from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { ResponseContext } from '../hooks/useContext';
import { Text } from "@rneui/base";
import parse from 'html-react-parser';


export const CreatePlaylistDialog = (prop: any) => {
  const context = React.useContext(ResponseContext);
  
  const getOembed = () => {
    return context.playlistId
  }

  const toggleDialog = () => {
    prop.toggle()
  };

  return (
    <View>
      <Dialog isVisible={prop.isOpen} onBackdropPress={toggleDialog} overlayStyle={styles.dialog}>
        {prop.isLoading ?
          <Dialog.Loading />
          :
          prop.httpStatus == 201 ?
            <div>
              {parse(getOembed())}
            </div>
            :
            prop.httpStatus == 404 ?
              <Text
                h2
                h2Style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: 'black',
                }}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                The playlist could not be created.<br />
                Please try again
              </Text>
              :
              <div>
                <Text
                  h2
                  h2Style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
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
    borderRadius: 12,
  },
  playlist: {
    borderRadius: 12
  },
});
