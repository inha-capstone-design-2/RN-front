import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import base64 from 'react-native-base64';
import {AxiosError} from 'axios';
import {customAxios} from '../utils/customAxios';
import {RootStackParamList} from '../../AppInner';
import jwt_decode from 'jwt-decode';
type SignInPageProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignInPage({navigation}: SignInPageProps) {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState(''); //string
  const [password, setPassword] = useState(''); //string

  const onPressLogin = async () => {
    try {
      const encoding = base64.encode(`${email}:${password}`);

      await customAxios
        .post(
          `/api/auth/login`,
          {},
          {
            headers: {Authorization: `basic ${encoding}`},
          },
        )
        .then(response => {
          const {accessToken, refreshToken} = response.data.data;

          var decoded = jwt_decode(accessToken) as any;

          if (!decoded.sub) {
            console.log('invalid user');
          }

          dispatch(
            userSlice.actions.setUser({
              userId: parseInt(decoded.sub),
              accessToken: accessToken,
              refreshToken: refreshToken,
            }),
          );

          EncryptedStorage.setItem(
            'refreshToken',
            response.data.data.refreshToken,
          );

          EncryptedStorage.setItem(
            'accessToken',
            response.data.data.accessToken,
          );
        });

      Alert.alert('알림', '로그인 성공');
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  };

  const onPressJoin = () => {
    navigation.navigate('SignUp');
  };

  const onPressPwdSearch = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>이메일</Text>
        <TextInput
          value={email}
          onChangeText={email => setEmail(email)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholder="Email address"
        />
      </View>
      <View style={styles.box}>
        <Text style={styles.text}>비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={password => setPassword(password)}
          secureTextEntry={true}
          autoCapitalize="none"
          style={styles.input}
          placeholder="Password"
        />
      </View>
      <TouchableOpacity onPress={onPressLogin}>
        <Text style={styles.login}>로그인</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity onPress={onPressJoin}>
          <Text style={styles.txtButton}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressPwdSearch}>
          <Text style={styles.txtButton}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.VertialLine}></View>
      <View>
        <TouchableOpacity style={styles.kakao}>
          <Text style={styles.kakaoTxt}>카카오 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.google}>
          <Text style={styles.googleTxt}>Google 계정으로 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    margin: 5,
  },

  text: {
    fontSize: 18,
    color: '#170F49',
    paddingLeft: 18,
  },

  input: {
    backgroundColor: '#fff',
    width: 300,
    height: 55,
    borderWidth: 1,
    borderColor: '#EFF0F6',
    borderRadius: 46,
    fontSize: 18,
    color: '#6F6C90',
    paddingLeft: 18,
    margin: 10,
  },

  login: {
    backgroundColor: '#4A3AFF',
    width: 300,
    height: 55,
    borderRadius: 46,
    fontSize: 18,
    color: '#fff',
    margin: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },

  txtButton: {
    color: '#6F6C90',
    fontSize: 16,
    marginHorizontal: 25,
    marginVertical: 5,
  },

  VertialLine: {
    width: 300,
    borderBottomColor: '#EFF0F6',
    borderBottomWidth: 1,
    marginVertical: 20,
  },

  kakao: {
    backgroundColor: '#FEE500',
    width: 300,
    height: 55,
    borderRadius: 46,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },

  kakaoTxt: {
    fontSize: 18,
    color: '#000000',
    opacity: 0.85,
    textAlign: 'center',
  },

  google: {
    backgroundColor: '#fff',
    width: 300,
    height: 55,
    borderRadius: 46,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },

  googleTxt: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
  },
});

export default SignInPage;