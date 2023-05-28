import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LoggedInParamList} from '../../AppInner';
import socket from '../utils/useSocket';
import {chatAxios} from '../utils/customAxios';
import {RootState} from '../store/reducer';
import {useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';

type ChatListProps = NativeStackScreenProps<LoggedInParamList, 'ChatList'>;

type ChatRoom = {
  programId: number;
  channelName: string;
  programName: string;
  episodeName: string;
  viewers: number;
};

type IChatRoom = {
  item: ChatRoom;
};

const ChatListPage = ({navigation}: ChatListProps) => {
  const myId = useSelector((state: RootState) => state.user.userId);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [canEnter, setCanEnter] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const isForbidden = async () => {
      const forbiddenTime = await EncryptedStorage.getItem('forbidden');

      if (forbiddenTime) {
        const canEnterTime = new Date(JSON.parse(forbiddenTime));

        const currentTime = new Date(); // 현재 시간 객체 생성
        currentTime.setMinutes(currentTime.getMinutes() - 10);

        console.log(currentTime);
        console.log(canEnterTime);

        if (currentTime.getTime() < canEnterTime.getTime()) {
          setCanEnter(false);
        }
      }
    };
    isForbidden();
  }, []);

  useEffect(() => {
    const getChatRooms = async () => {
      await chatAxios.get('/v1/room').then(response => {
        setChatRooms(response.data.data);
      });
    };
    getChatRooms();
  }, []);

  const renderItem = ({item}: IChatRoom) => {
    const {programId, channelName, programName, episodeName, viewers} = item;
    const onAir = true;
    return (
      <Swipeable>
        <TouchableOpacity
          style={styles.chatRoom}
          onPress={() => {
            if (canEnter) {
              toChatRoom(programId, `${programName}-${episodeName}`, true);
            } else {
              Alert.alert(
                '경고',
                `욕설이나 비방하는 채팅을 5회이상 사용하여 일시적으로 채팅방 입장이 금지됩니다`,
              );
            }
          }}>
          <View>
            <Text style={styles.chatRoomName}>
              {channelName} - {programName}
            </Text>
            <Text style={styles.chatRoomDescription}>{episodeName}</Text>
          </View>
          {onAir ? (
            <View style={styles.itemContainer}>
              <View style={styles.onAirContainer}>
                <Text style={styles.onAirText}>On Air</Text>
              </View>

              <View style={styles.viewersContainer}>
                <Ionicons name="eye-outline" size={16} color="#333" />
                <Text style={styles.viewersText}>{viewers}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.itemContainer}>
              <View style={styles.offAirContainer}>
                <Text style={styles.onAirText}>On Air</Text>
              </View>

              <View style={styles.viewersContainer}>
                <Ionicons name="eye-outline" size={16} color="#333" />
                <Text style={styles.viewersText}>{viewers}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const handleRefresh = async () => {
    setChatRooms([...chatRooms]);
    setIsRefreshing(true);
  };

  const toChatRoom = (
    programId: number,
    programName: string,
    onAir: boolean,
  ) => {
    socket.emit('joinRoom', programId, myId);
    navigation.navigate('Chat', {programId, programName, onAir});
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  chatRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  chatRoomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatRoomDescription: {
    fontSize: 16,
    color: '#444444',
  },
  createRoomButton: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    padding: 16,
    alignSelf: 'center',
  },
  createRoomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  swipeable: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 16,
  },
  swipeableText: {
    fontSize: 16,
    color: '#ffffff',
    padding: 16,
    alignSelf: 'center',
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  onAirContainer: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  offAirContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  onAirText: {
    color: '#ffffff',
    fontSize: 12,
  },
  viewersContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  viewersText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default ChatListPage;
