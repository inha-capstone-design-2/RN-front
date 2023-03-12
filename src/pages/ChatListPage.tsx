import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ChatListPage() {
  return (
    <View>
      <Text>ChatListPage</Text>
    </View>
  );
}

export default ChatListPage;
