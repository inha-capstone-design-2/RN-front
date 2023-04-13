import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ProgramList() {
  return (
    <View>
      <Text>ProgramList</Text>
    </View>
  );
}

export default ProgramList;
