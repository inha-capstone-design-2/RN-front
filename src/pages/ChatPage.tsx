import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ChatPage() {
  return (
    <View>
      <Text>ChatPage</Text>
    </View>
  );
}

export default ChatPage;
