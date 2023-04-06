import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Ionicons from 'react-native-vector-icons/Ionicons';

const data = [
  {
    id: '1',
    name: 'SBS - 도깨비',
    description: '16화 - 회차 이름',
    onAir: true,
    viewers: 12,
  },
  {
    id: '2',
    name: 'KBS - 모범 택시',
    description: '14화 - 회차 이름',
    onAir: true,
    viewers: 43,
  },
  {
    id: '3',
    name: 'SPOTV',
    description: '맨유 VS 아스날',
    onAir: false,
    viewers: 253,
  },
];

const ChatListPage = () => {
  const navigation = useNavigation();
  const [chatRooms, setChatRooms] = useState(data);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const renderItem = ({item}) => {
    const {id, name, description, onAir, viewers} = item;
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity style={styles.chatRoom} onPress={toChatRoom}>
          <View>
            <Text style={styles.chatRoomName}>{name}</Text>
            <Text style={styles.chatRoomDescription}>{description}</Text>
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

  const renderRightActions = item => {
    const handleDelete = () => {
      const updatedChatRooms = chatRooms.filter(
        chatRoom => chatRoom.id !== item.id,
      );
      setChatRooms(updatedChatRooms);
    };

    return (
      <Animated.View style={styles.swipeable}>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.swipeableText}>Exit</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const toChatRoom = () => {
    navigation.navigate('ChatPage');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        keyExtractor={item => item.id}
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
