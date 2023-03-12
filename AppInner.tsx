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

function AppInner() {
  const isLoggedIn = false;

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="ProgramList"
        component={ProgramListPage}
        options={{title: '프로그램 편성표'}}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesPage}
        options={{title: '즐겨찾기'}}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListPage}
        options={{title: '채팅방'}}
      />
      <Tab.Screen
        name="Setting"
        component={SettingPage}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
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
