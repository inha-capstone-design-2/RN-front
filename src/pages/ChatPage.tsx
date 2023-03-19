import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSmile} from '@fortawesome/free-solid-svg-icons';

const Stack = createNativeStackNavigator();

function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [imoticonBar, setImoticonBar] = useState(false);

  const sendMessage = () => {
    if (message.trim() === '') {
      return;
    }

    const newMessages = [...messages];
    newMessages.push({text: message, sender: 'me'});
    setMessages(newMessages);
    setMessage('');
  };

  const handleEmoticonPress = () => {
    setImoticonBar(!imoticonBar);
  };

  const handleTogglePopover = () => {
    setImoticonBar(!imoticonBar);
  };

  // 채팅자 수, 안에 이모티콘
  // 채팅 방안에 이모티콘 눌럿을때 이모지 나옴
  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((m, i) => (
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
        ))}
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
            onPress={handleEmoticonPress}
            style={styles.emoticonButton}>
            <FontAwesomeIcon icon={faSmile} style={styles.emoticonIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={imoticonBar} animationType="slide">
        <View style={styles.popoverContainer}>
          <TouchableOpacity
            onPress={handleTogglePopover}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <View style={styles.popoverContent}>
            <Text style={styles.popoverText}>This is the popover content.</Text>
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
    height: '50%',
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
});

export default ChatPage;
