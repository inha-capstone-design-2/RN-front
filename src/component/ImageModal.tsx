import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

const ImageModal = ({onImageSelected}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const images = [
    {id: '1', uri: 'https://picsum.photos/id/1/200/200'},
    {id: '2', uri: 'https://picsum.photos/id/2/200/200'},
    {id: '3', uri: 'https://picsum.photos/id/3/200/200'},
    {id: '4', uri: 'https://picsum.photos/id/4/200/200'},
    {id: '5', uri: 'https://picsum.photos/id/5/200/200'},
    {id: '6', uri: 'https://picsum.photos/id/6/200/200'},
    {id: '7', uri: 'https://picsum.photos/id/7/200/200'},
    {id: '8', uri: 'https://picsum.photos/id/8/200/200'},
    {id: '9', uri: 'https://picsum.photos/id/9/200/200'},
  ];

  const chooseImage = uri => {
    setModalVisible(false);
    onImageSelected({uri});
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.chooseImageText}>Choose an Image</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        presentationStyle="overFullScreen">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity> */}
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              {images.map(image => (
                <TouchableOpacity
                  key={image.id}
                  onPress={() => chooseImage(image.uri)}
                  style={styles.imageItem}>
                  <Image
                    source={{uri: image.uri}}
                    style={{flex: 1}}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  chooseImageText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: '90%',
    maxHeight: '80%',
  },
  scrollViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  imageItem: {
    width: '30%',
    height: undefined,
    aspectRatio: 1,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ImageModal;
