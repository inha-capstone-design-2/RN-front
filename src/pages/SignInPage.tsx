import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function SignInPage() {
  return (
    <View>
      <Text>SignInPage</Text>
    </View>
  );
}

export default SignInPage;
