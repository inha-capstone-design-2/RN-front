import React, {useEffect, useRef, useState} from 'react';
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
import WriteArticlePage from './src/pages/WriteArticlePage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import socket from './src/utils/useSocket';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faList,
  faStar,
  faComments,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';
import {customAxios} from './src/utils/customAxios';
import {useAppDispatch} from './src/store';
import SplashScreen from 'react-native-splash-screen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export type LoggedInParamList = {
  ProgramList: undefined;
  Favorites: undefined;
  ChatList: undefined;
  Chat: {
    programId: number;
    programName: string;
    onAir: boolean;
  };
  ProgramDetail: {
    programId: number;
    programTitle: string;
    isBookmarked: boolean;
  };
  Articles: {
    programId: number;
    programTitle: string;
  };
  Article: {
    programId: number;
    articleId: number;
  };
  WriteArticle: {
    programId: number;
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
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#4A3AFF',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="ProgramList"
        component={ProgramListPage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <FontAwesomeIcon
              style={focused ? {color: '#4A3AFF'} : {color: 'gray'}}
              icon={faList}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesPage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <FontAwesomeIcon
              style={focused ? {color: '#4A3AFF'} : {color: 'gray'}}
              icon={faStar}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListPage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <FontAwesomeIcon
              style={focused ? {color: '#4A3AFF'} : {color: 'gray'}}
              icon={faComments}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingPage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <FontAwesomeIcon
              style={focused ? {color: '#4A3AFF'} : {color: 'gray'}}
              icon={faGear}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppInner() {
  const dispatch = useAppDispatch();

  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected');
    });
  }, []);

  // token이 있다면 즉시 로그인
  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const refreshToken = await EncryptedStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        var decoded = jwt_decode(accessToken) as any;

        if (!decoded.sub) {
          console.log('invalid user');
        }

        const myId = parseInt(decoded.sub);

        await customAxios
          .get(`/api/member/{member-id}?member-id=${myId!}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(response => {
            const {nickname, email} = response.data.data;

            dispatch(
              userSlice.actions.setUser({
                userId: myId,
                nickname: nickname,
                email: email,
                accessToken: accessToken,
                refreshToken: refreshToken,
              }),
            );
          });

        SplashScreen.hide();
        return;
      }

      SplashScreen.hide();
    };

    getAccessToken();
  }, [dispatch]);

  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config;
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            const accessToken = await EncryptedStorage.getItem('accessToken');

            await axios
              .post(
                `http://3.36.97.254:8080/api/auth/reissue`, // token refresh api
                {
                  accessToken,
                  refreshToken,
                },
                {headers: {authorization: `Bearer ${refreshToken}`}},
              )
              .then(response => {
                const {accessToken, refreshToken} = response.data.data;

                dispatch(
                  userSlice.actions.setUser({
                    accessToken,
                    refreshToken,
                  }),
                );

                EncryptedStorage.setItem('refreshToken', refreshToken);
                EncryptedStorage.setItem('accessToken', refreshToken);

                originalRequest.headers.authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
              });
          }
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

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
      <Stack.Screen
        name="WriteArticle"
        component={WriteArticlePage}
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
