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
      <Dialog isVisible={prop.visible} onBackdropPress={toggleDialog} overlayStyle={styles.dialog}>
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
  dialog: {
    // backgroundColor: 'black',
    borderRadius: 12,
  },
})