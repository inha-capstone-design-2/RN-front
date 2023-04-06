import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatListPage from './src/pages/ChatListPage';
import ChatPage from './src/pages/ChatPage';
import FavoritesPage from './src/pages/FavoritesPage';
import ProgramDetailPage from './src/pages/ProgramDetailPage';
import ProgramListPage from './src/pages/ProgramListPage';
import SettingPage from './src/pages/SettingPage';
import SignInPage from './src/pages/SignInPage';
import SignUpPage from './src/pages/SignUpPage';
import AlarmSettingPage from './src/pages/AlarmSettingPage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ProgramList"
        component={ProgramListPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Setting"
        component={SettingPage}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

function AppInner() {
  const isLoggedIn = true;

  return isLoggedIn ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{headerShown: false}}
      />
      <Stack.Screen name="ChatPage" component={ChatPage} />
      <Stack.Screen name="AlarmSetting" component={AlarmSettingPage} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInPage}
        options={{title: '로그인'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpPage}
        options={{title: '회원가입'}}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
