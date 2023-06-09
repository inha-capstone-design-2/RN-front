import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

const SettingsPage = () => {
  const {email, nickname} = useSelector((state: RootState) => state.user);

  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [alarmMode, setAlarmMode] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleAlarmModeToggle = () => {
    setAlarmMode(!alarmMode);
  };

  const toAlarmSetting = () => {
    navigation.navigate('AlarmSetting');
  };

  const toPhoto = () => {
    check(PERMISSIONS.ANDROID.CAMERA).then(result => {
      console.log(result);
      if (result === RESULTS.DENIED) {
        return ImagePicker.openPicker({
          includeExif: true,
          includeBase64: true,
          mediaType: 'photo',
        });
      } else if (result === RESULTS.UNAVAILABLE) {
        return Alert.alert(
          '앨범 접근 권한을 허용해주세요',
          '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
          [
            {
              text: '네',
              onPress: () => Linking.openSettings(),
            },
            {
              text: '아니오',
              onPress: () => console.log('No Pressed'),
              style: 'cancel',
            },
          ],
        );
      } else {
        return ImagePicker.openPicker({
          includeExif: true,
          includeBase64: true,
          mediaType: 'photo',
        })
          .then(uploadPhoto)
          .catch(console.log);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileImageContainer} onPress={toPhoto}>
        <Image
          style={styles.profileImage}
          source={{
            uri: 'https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800',
          }}
        />
        <Text style={styles.profileImageText}>Change Profile Image</Text>
      </TouchableOpacity>
      <View style={styles.nicknameContainer}>
        <View style={styles.nickname}>
          <Text style={styles.nicknameLabel}>Nickname:</Text>
          <Text>{nickname}</Text>
        </View>

        <View style={styles.nickname}>
          <Text style={styles.nicknameLabel}>email:</Text>
          <Text>{email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#333',
  },
  profileImageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  nicknameContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 16,
    paddingBottom: 4,
  },

  nickname: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  nicknameLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  nicknameText: {
    fontSize: 18,
  },
  nicknameChangeButton: {
    backgroundColor: '#0084ff',
    borderRadius: 3,
    padding: 4,
    alignSelf: 'center',
  },
  nicknameChangeButtonText: {
    color: 'white',
    fontSize: 15,
  },

  containerDark: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },

  alarmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },

  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    color: 'black',
  },
  modeSwitch: {
    marginLeft: 'auto',
  },

  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  toAlarmSettingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    color: 'black',
  },

  resignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: '#e0e0e0',
  },

  resignText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    color: 'red',
  },

  explainText: {
    fontSize: 12,
  },
});
export default SettingsPage;
