import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ProgramDetailPage() {
  return (
    <View>
      <Text>ProgramDetailPage</Text>
    </View>
  );
}

export default ProgramDetailPage;
