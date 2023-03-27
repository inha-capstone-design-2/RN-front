import React, {useState} from 'react';
import {
  StyleSheet,
  Text, 
  View, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function SignInPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");//string
  const [password, setPassword] = useState("");//string
  const [loggedIn, setLoggedIn] = useState(false);//bool

  const onPressLogin = () => {
    setLoggedIn(!loggedIn);
  }

  const onPressLogout = () => {
    setLoggedIn(!loggedIn);
    setEmail("");
    setPassword("");
  }

  const onPressJoin = () => {
    navigation.navigate('SignUpPage');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>로그인</Text>
      </View>
      <View style={styles.main}>
        {
          loggedIn ? 
          <View style={styles.headerTxt}>
            <Text>로그인 되었습니다.</Text>
            <Text>email: {email}</Text>
            <Text>비밀번호: {password}</Text>
            <TouchableOpacity onPress={onPressLogout}>
              <Text style={styles.login}>로그아웃</Text>
            </TouchableOpacity>
          </View> :
          <View>
            <View style={styles.box}>
              <Text>이메일</Text>
              <TextInput value={email} onChangeText={(email) => setEmail(email)} keyboardType="email-address" autoCapitalize="none" style={styles.input}/>
            </View>
            <View style={styles.box}>
              <Text>비밀번호</Text>
              <TextInput value={password} onChangeText={(password) => setPassword(password)} secureTextEntry={true} autoCapitalize="none" style={styles.input}/>
            </View>
            <TouchableOpacity onPress={onPressLogin}>
              <Text style={styles.login}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressJoin}>
              <Text style={styles.join}>회원가입</Text>
            </TouchableOpacity>
            <View style={{flexDirection: "row", justifyContent: 'center'}}>
              <TouchableOpacity style={styles.kakao}>
                <Text>카카오 로그인</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.google}>
                <Text>구글 로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },

  header: {
    flex: 1,
    borderBottomColor: "darkgray",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 20,
  },

  headerTxt: {
    fontSize: 26,
    marginLeft: 20,
  },

  main: {
    flex: 10,
    marginTop: 100,
  },

  input: {
    backgroundColor: "white",
    borderColor: "darkgray",
    borderWidth: 1,
    fontSize:18,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  box: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },

  login: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth:1,
    borderColor: "black",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
  },

  join: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth:1,
    borderColor: "black",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
  },

  kakao: {
    marginVertical: 30,
    marginLeft: 30,
    marginRight:5,
    fontSize: 18,
    width:140,
    height:70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    borderRadius: 10,
  },

  google: {
    marginVertical: 30,
    marginLeft: 5,
    marginRight:30,
    width:140,
    height:70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth:1,
    borderColor: "lightgray",
    borderRadius: 10,
  },
});

export default SignInPage;
