import React from 'react';
import {
  Dialog,
} from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export const DeletePlaylistDialog = (prop: any) => {
  const toggleDialog = () => {
    prop.changeVisible(!prop.visible)
  };

  return (
    <View>
      <Dialog isVisible={prop.visible} onBackdropPress={toggleDialog}>
        {prop.isLoading ?
          <Dialog.Loading />
          :
          prop.httpStatus != 0 && prop.httpStatus == 200 ?
            <div>
              delete playlist
            </div>
            :
            <div>
              delete error
            </div>
        }
        {/* todo エラーの考慮 */}
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
