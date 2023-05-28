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
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
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
import {chatAxios, customAxios} from '../utils/customAxios';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from '../slices/user';

type ChatPageProps = NativeStackScreenProps<LoggedInParamList, 'Chat'>;

type Chat = {
  nickname: string;
  userId: number;
  programId: number;
  text: string | null;
  image: boolean;
  imageUri: string | null;
};

function ChatPage({navigation, route}: ChatPageProps) {
  const myId = useSelector((state: RootState) => state.user.userId);
  const myNickname = useSelector((state: RootState) => state.user.nickname);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const myCuss = useSelector((state: RootState) => state.user.cuss);

  const {programId, programName} = route.params;
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Chat[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cussNum, setCussNum] = useState(myCuss);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    try {
      const getMessages = async () => {
        await chatAxios.get(`/v1/chat/${programId}`).then(response => {
          const chats = response.data.data;
          setMessages(chats);
          scrollToBottom();
        });
      };

      getMessages();
      scrollToBottom();
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
            programId: chat.programId,
            text: chat.text,
            image: chat.image,
            imageUri: chat.imageUri,
          },
        ]);
        scrollToBottom();
      }
    },
    [socket],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
  }, [socket, onMessage, scrollViewRef]);

  const sendMessage = async () => {
    try {
      if (message.trim() === '') {
        return;
      }

      const isCuss = message.match(
        /[시씨슈쓔쉬쉽쒸쓉]([0-9]*|[0-9]+ *)[바발벌빠빡빨뻘파팔펄]|[섊좆좇졷좄좃좉졽썅춍]|ㅅㅣㅂㅏㄹ?|ㅂ[0-9]*ㅅ|[ㅄᄲᇪᄺᄡᄣᄦᇠ]|[ㅅㅆᄴ][0-9]*[ㄲㅅㅆᄴㅂ]|[존좉좇][0-9 ]*나|[자보][0-9]+지|보빨|[봊봋봇봈볻봁봍] *[빨이]|[후훚훐훛훋훗훘훟훝훑][장앙]|후빨|[엠앰]창|애[미비]|애자|[^탐]색기|([샊샛세쉐쉑쉨쉒객갞갟갯갰갴겍겎겏겤곅곆곇곗곘곜걕걖걗걧걨걬] *[끼키퀴])|새 *[키퀴]|[병븅]신|미친[가-닣닥-힣]|[믿밑]힌|[염옘]병|[샊샛샜샠섹섺셋셌셐셱솃솄솈섁섂섓섔섘]기|[섹섺섻쎅쎆쎇쎽쎾쎿섁섂섃썍썎썏][스쓰]|지랄|니[애에]미|갈[0-9]*보[^가-힣]|[뻐뻑뻒뻙뻨][0-9]*[뀨큐킹낑)|꼬추|곧휴|[가-힣]슬아치|자박꼼|[병븅]딱|빨통|[사싸](이코|가지|까시)|육시[랄럴]|육실[알얼할헐]|즐[^가-힣]|찌(질이|랭이)|찐따|찐찌버거|창[녀놈]|[가-힣]{2,}충[^가-힣]|[가-힣]{2,}츙|부녀자|화냥년|환[양향]년|호[구모]|조[선센][징]|조센|[쪼쪽쪾]([발빨]이|[바빠]리)|盧|무현|찌끄[레래]기|(하악){2,}|하[앍앜]|[낭당랑앙항남담람암함][ ]?[가-힣]+[띠찌]|느[금급]마|文在|在寅|(?<=[^\n])[家哥]|속냐|[tT]l[qQ]kf|Wls/,
      );

      if (!isCuss) {
        setCussNum(cussNum + 1);

        if (cussNum == 5) {
          await EncryptedStorage.setItem(
            'forbidden',
            JSON.stringify(new Date()),
          );

          userSlice.actions.increaseCuss({cuss: 0});

          Alert.alert(
            '경고',
            `욕설이나 비방하는 채팅을 5회이상 사용하여 강퇴되셨습니다`,
          );

          return navigation.goBack();
        }

        userSlice.actions.increaseCuss({cuss: cussNum + 1});
        setMessage('');
        return Alert.alert(
          '경고',
          `욕설이나 남을 비방하는 채팅은 금지입니다. 남은 횟수 ${5 - cussNum}`,
        );
      }

      await chatAxios
        .post('/v1/chat/', {
          userId: myId,
          nickname: myNickname,
          programId: programId,
          text: message,
          image: false,
          imageUri: null,
        })
        .then(response => {
          setMessages([
            ...messages,
            {
              userId: myId,
              nickname: myNickname,
              programId: programId,
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
        .post('/v1/chat/', {
          nickname: 'minwoo',
          userId: myId,
          programId: programId,
          text: null,
          image: true,
          imageUri: imageUri,
        })
        .then(response => {
          setMessages([
            ...messages,
            {
              nickname: 'minwoo',
              userId: myId,
              programId: programId,
              text: null,
              image: true,
              imageUri: imageUri,
            },
          ]);

          setModalVisible(false);
        });
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const reportUser = useCallback(() => {}, []);

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
            onPress: async () => {
              console.log(accessToken);
              await customAxios
                .post(
                  '/api/report/',
                  {
                    content: 'test',
                    title: '신고',
                    type: 'USER_REPORT',
                  },
                  {
                    headers: {Authorization: `Bearer ${accessToken}`},
                  },
                )
                .then(response => {});
            },
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
  }, []);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      scrollToBottom,
    );

    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      scrollToBottom,
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerBackButton} onPress={goBack}>
          <Text>뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{programName}</Text>
      </View>

      {/* chat */}
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: false})
        }
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
