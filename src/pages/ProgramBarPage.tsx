import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ProgramBarPage() {
  return (
    <View>
      <Text>ProgramBarPage</Text>
    </View>
  );
}

export default ProgramBarPage;
