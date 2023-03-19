import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

function ChatListPage() {
  const navigation = useNavigation();

  const handleChatPress = () => {
    navigation.navigate('ChatPage');
  };
  return (
    <View>
      <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
        <Text style={styles.chatButtonText}>Chatting room 1</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    margin: 10,
    backgroundColor: '#0084ff',
    padding: 10,
    borderRadius: 5,
  },
  chatButtonText: {
    color: '#fff',
  },
});

export default ChatListPage;
