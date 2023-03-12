import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function SettingPage() {
  return (
    <View>
      <Text>SettingPage</Text>
    </View>
  );
}

export default SettingPage;
