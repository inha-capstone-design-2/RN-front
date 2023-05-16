import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  Alert,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  Button,
} from 'react-native';

import customImages from '../customImage';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSmile} from '@fortawesome/free-solid-svg-icons';
import {LoggedInParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import socket from '../utils/useSocket';
import axios from 'axios';
import {RootState} from '../store/reducer';
import {useSelector} from 'react-redux';

type ChatPageProps = NativeStackScreenProps<LoggedInParamList, 'Chat'>;

type Chat = {
  nickname: string;
  userId: number;
  roomId: number;
  text: string | null;
  image: boolean;
  imageUri: string | null;
  // timeline: Date;
};

type SocketChat = {
  text: string;
  userId: number;
};

function ChatPage({navigation, route}: ChatPageProps) {
  const myId = useSelector((state: RootState) => state.user.userId);

  const {roomId, roomName, onAir} = route.params;
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Chat[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // 초기 메세지 load
  useEffect(() => {
    try {
      const getMessages = async () => {
        await axios.get('http://10.0.2.2:4000/v1/chat/1').then(response => {
          const chats = response.data.data;
          setMessages(chats);
          scrollToBottom();
        });
      };

      getMessages();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onMessage = useCallback(
    (chat: Chat) => {
      if (chat.userId !== myId) {
        setMessages([
          ...messages,
          {
            nickname: chat.nickname,
            userId: chat.userId,
            roomId: chat.roomId,
            text: chat.text,
            image: chat.image,
            imageUri: chat.imageUri,
          },
        ]);
      }
    },
    [socket],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
  }, [socket, onMessage]);

  const sendMessage = async () => {
    try {
      if (message.trim() === '') {
        return;
      }

      await axios
        .post('http://10.0.2.2:4000/v1/chat/', {
          nickname: 'test',
          userId: 1,
          roomId: 1,
          text: message,
          image: false,
          imageUri: null,
        })
        .then(response => {
          setMessages([
            ...messages,
            {
              nickname: 'test',
              userId: 1,
              roomId: 1,
              text: message,
              image: false,
              imageUri: null,
            },
          ]);

          setMessage('');
          scrollToBottom();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const sendImage = async (imageUri: string) => {
    try {
      await axios
        .post('http://10.0.2.2:4000/v1/chat/', {
          nickname: '가자가자',
          userId: 1,
          roomId: 1,
          text: null,
          image: true,
          imageUri: imageUri,
        })
        .then(response => {
          setMessages([
            ...messages,
            {
              nickname: '가자가자',
              userId: 1,
              roomId: 1,
              text: null,
              image: true,
              imageUri: imageUri,
            },
          ]);

          setModalVisible(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // 신고하기 로직
  const timeoutRef = useRef<number | null>(null);

  const reportPressIn = useCallback(
    (userId: number, userNickname: string) => {
      timeoutRef.current = setTimeout(() => {
        Alert.alert('신고하기', `${userNickname}님을 신고하시겠습니까?`, [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '신고',
            onPress: () => {},
          },
        ]);
      }, 1000);
    },
    [timeoutRef],
  );

  const reportPressOut = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
  }, [timeoutRef]);

  const goBack = useCallback(() => {
    socket.emit('leaveRoom', 1, 1);
    navigation.goBack();
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({animated: false});
  }, [scrollViewRef]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerBackButton} onPress={goBack}>
          <Text>뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{roomName}</Text>
      </View>

      {/* chat */}
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}>
        {messages.map((m, i) => {
          return (
            <View style={styles.messageContainer}>
              <TouchableOpacity
                onPressIn={() => reportPressIn(m.userId, m.nickname)}
                onPressOut={reportPressOut}>
                <Text style={styles.userNickname}>{m.nickname}: </Text>
              </TouchableOpacity>

              {m.image ? (
                <Image
                  key={i}
                  source={{uri: m.imageUri!}}
                  style={styles.imageSize}
                  resizeMode="cover"
                />
              ) : (
                <Text key={i} style={styles.message}>
                  {m.text}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

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
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              {customImages.map(image => (
                <TouchableOpacity
                  key={image.id}
                  onPress={() => sendImage(image.uri)}
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
    </KeyboardAvoidingView>
  );
}

const getRandomColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },

  // 헤더
  headerContainer: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerBackButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  // 채팅
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  userNickname: {
    color: getRandomColor(),
  },
  message: {
    color: 'black',
  },
  imageSize: {
    width: 120,
    height: 120,
  },

  // 채팅 입력란
  bottom: {
    flex: 1,
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
