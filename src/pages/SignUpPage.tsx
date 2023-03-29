import React from 'react';
import { 
  StyleSheet,
  Text, 
  View, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import {useState} from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import base64 from 'react-native-base64';

const Stack = createNativeStackNavigator();

function SignUpPage() {
  const [email, setEmail] = useState("");//string
  const [password, setPassword] = useState("");//string
  const [nickname, setNickname] = useState("");//string

  const [isLocalJoin, setIsLocalJoin] = useState(false);//bool

  const [eamilValid, setEmailValid] = useState(false);//bool
  const [pwdValid, setPwdValid] = useState(false);//bool
  const [nameValid, setNameValid] = useState(false);//bool

  const [emailMsg, setEmailMsg] = useState("");//string
  const [passwordMsg, setPasswordMsg] = useState("");//string
  const [nicknameMsg, setNicknameMsg] = useState("");//string  

  const checkEmail = () => {
    if(email=="") return
    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    if (regExp.test(email)){
      setEmailMsg("");
      setEmailValid(true);
    }
    else{
      setEmailMsg("올바른 형식의 이메일을 입력해주세요");
      setEmailValid(false);
    }
  }

    const checkPassword = () => {
      if(password=="") return
      const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/
      if (regExp.test(password)){
        setPasswordMsg("");
        setPwdValid(true);
      }
      else{
        setPasswordMsg("8~16자 사이의 영문, 숫자 조합으로 입력해주세요");
        setPwdValid(false);
      }
    }

     const checkNickname = () => {
      if(nickname=="") return
      const regExp = /^[0-9가-힣a-zA-z]{2,10}$/
        if(regExp.test(nickname)){
          setNicknameMsg("");
          setNameValid(true);
        }
        else{
          setNicknameMsg("2~10자 사이의 한글, 영문, 숫자 조합으로 입력해주세요");
          setNameValid(false);
        }
    }

    const onPressJoin = () => {
      checkEmail();
      checkPassword();
      checkNickname();
      if(eamilValid&&pwdValid&&nameValid){
        setPassword((current)=>base64.encode(current));
      }
    }

  return (
    <View style={styles.container}>
      {           
        isLocalJoin?(
          <View>
            <View style={styles.box}>
              <Text style={styles.text}>이메일</Text>
              <TextInput 
                value={email} 
                onChangeText={(email) => setEmail(email)} 
                onBlur={checkEmail} 
                keyboardType="email-address" 
                autoCapitalize="none" 
                style={styles.input}
                placeholder="Email address"
              />
              <Text style={styles.message}>{emailMsg}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>비밀번호</Text>
              <TextInput 
                value={password} 
                onChangeText={(password) => setPassword(password)} 
                onBlur={checkPassword} 
                secureTextEntry={true} 
                autoCapitalize="none" 
                style={styles.input}
                placeholder="Password"
              />
              <Text style={styles.message}>{passwordMsg}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>닉네임</Text>
              <TextInput 
                value={nickname} 
                onChangeText={(nickname) => setNickname(nickname)} 
                onBlur={checkNickname} 
                autoCapitalize="none" 
                style={styles.input}
                placeholder="Nickname"
              />
              <Text style={styles.message}>{nicknameMsg}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.join} onPress={onPressJoin}>회원가입</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity onPress={()=>setIsLocalJoin(true)}>
              <Text style={styles.join}>이메일로 가입하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.kakao}>
              <Text style={styles.kakaoTxt}>카카오로 가입하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.google}>
              <Text style={styles.googleTxt}>Google 계정으로 가입하기</Text>
            </TouchableOpacity>
          </View>
        )
      }     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    margin: 5,
  },

  text: {
    fontSize: 18,
    color: "#170F49",
    paddingLeft: 18,
  }, 

  input: {
    backgroundColor: '#fff',
    width: 300,
    height: 55,
    borderWidth: 1,
    borderColor: "#EFF0F6",
    borderRadius: 46,
    fontSize: 18,
    color: "#6F6C90",
    paddingLeft: 18,
    margin: 10,
  },

  join: {
    backgroundColor: '#4A3AFF',
    width: 300,
    height: 55,
    borderRadius: 46,
    fontSize: 18,
    color: "#fff",
    margin: 10,
    textAlign: "center",
    textAlignVertical: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },

  txtButton: {
    color: "#6F6C90",
    fontSize: 16,
    marginHorizontal: 25,
    marginVertical: 5,
  },

  kakao: {
    backgroundColor: "#FEE500",
    width: 300,
    height: 55,
    borderRadius: 46,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
  },

  kakaoTxt: {
    fontSize: 18,
    color: "#000000",
    opacity: 0.85,
    textAlign: "center",
  },

  google: {
    backgroundColor: "#fff",
    width: 300,
    height: 55,
    borderRadius: 46,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
  },

  googleTxt: {
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
  },

  message: {
    color: "#F15F5F",
    fontSize: 12,
    paddingLeft: 18,
  }
});

export default SignUpPage;
