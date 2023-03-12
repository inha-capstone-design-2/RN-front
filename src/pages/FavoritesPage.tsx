import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function FavoritesPage() {
  return (
    <View>
      <Text>FavoritesPage</Text>
    </View>
  );
}

export default FavoritesPage;
