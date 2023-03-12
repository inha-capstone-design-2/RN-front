import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ProgramListPage() {
  return (
    <View>
      <Text>ProgramListPage</Text>
    </View>
  );
}

export default ProgramListPage;
