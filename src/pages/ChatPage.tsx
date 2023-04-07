import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSmile} from '@fortawesome/free-solid-svg-icons';
import customImages from '../customImage';

function ChatPage({route, navigation}) {
  const {roomId} = route;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [imoticonBar, setImoticonBar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const chooseImage = (imageUri: string) => {
    setModalVisible(false);
    const newMessages = [...messages];
    newMessages.push({imageUri: imageUri, sender: 'me', image: true});
    setMessages(newMessages);
  };

  const sendMessage = () => {
    if (message.trim() === '') {
      return;
    }

    const newMessages = [...messages];
    newMessages.push({text: message, sender: 'me', image: false});
    setMessages(newMessages);
    setMessage('');
  };

  // 채팅자 수, 안에 이모티콘
  // 채팅 방안에 이모티콘 눌럿을때 이모지 나옴
  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((m, i) => {
          if (!m.image) {
            return (
              <View
                key={i}
                style={
                  m.sender === 'me'
                    ? styles.myMessageContainer
                    : styles.otherMessageContainer
                }>
                <Text
                  style={
                    m.sender === 'me'
                      ? styles.myMessageText
                      : styles.otherMessageText
                  }>
                  {m.text}
                </Text>
              </View>
            );
          } else {
            return (
              <View
                style={
                  m.sender === 'me'
                    ? styles.myImageContainer
                    : styles.otherImageContainer
                }>
                <Image
                  key={i}
                  source={{uri: m.imageUri}}
                  style={styles.imageSize}
                  resizeMode="cover"
                />
              </View>
            );
          }
        })}
      </View>

      {/* chat-bar */}
      <View style={styles.inputContainer}>
        <View style={styles.bottom}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={text => setMessage(text)}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.emoticonButton}>
            <FontAwesomeIcon icon={faSmile} style={styles.emoticonIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

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
              {customImages.map(image => (
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  bottom: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  myImageContainer: {
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginBottom: 5,
  },
  otherImageContainer: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  imageSize: {
    width: 120,
    height: 120,
  },
  myMessageContainer: {
    backgroundColor: '#4E5BF6',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  otherMessageContainer: {
    backgroundColor: '#F1F1F1',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  emoticonButton: {
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,

    backgroundColor: 'transparent',
  },
  emoticonIcon: {
    fontSize: 20,
    color: '#A0A0A0',
  },
  sendButton: {
    backgroundColor: '#0084ff',
    padding: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#fff',
  },
  popoverContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popoverContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    height: '80%',
    justifyContent: 'center',
  },
  popoverText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // modal
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
});

export default ChatPage;
