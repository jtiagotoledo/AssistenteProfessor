import React from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

type ModalFotoAlunoProps = {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
};

const ModalFotoAluno = ({ visible, imageUrl, onClose }: ModalFotoAlunoProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={onClose}
        activeOpacity={1}
      >
        {imageUrl && (
          <FastImage
            style={styles.modalImage}
            source={{ uri: imageUrl }}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalFotoAluno;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
});
