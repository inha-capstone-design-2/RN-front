import React, {useEffect, useState} from 'react';
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
import ArticlesPage from './src/pages/ArticlesPage';
import ArticlePage from './src/pages/ArticlePage';
import userSlice from './src/slices/user';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export type LoggedInParamList = {
  ProgramList: undefined;
  Favorites: undefined;
  ChatList: undefined;
  Chat: {
    roomId: number;
    roomName: string;
    onAir: boolean;
  };
  ProgramDetail: {
    programId: number;
  };
  Articles: {
    programId: number;
  };
  Article: {
    articleId: number;
  };
  Setting: undefined;
  AlarmSetting: undefined;
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
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  return isLoggedIn ? (
    <Stack.Navigator screenOptions={{gestureEnabled: true}}>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{headerShown: false, gestureEnabled: true}}
      />
      <Stack.Screen
        name="Chat"
        component={ChatPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProgramDetail"
        component={ProgramDetailPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Articles"
        component={ArticlesPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Article"
        component={ArticlePage}
        options={{headerShown: false}}
      />
      <Stack.Screen name="AlarmSetting" component={AlarmSettingPage} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInPage}
        options={{title: '로그인', gestureEnabled: true}}
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
