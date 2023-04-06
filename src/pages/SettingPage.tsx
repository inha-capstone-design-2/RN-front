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

const SettingsPage = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState();
  const [nickname, setNickname] = useState('nickname');
  const [images, setImages] = useState<{uri: string}>();
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

  const uploadPhoto = useCallback(
    async response => {
      console.log(response);
      setImages([
        ...images,
        {uri: `data:${response.mime};base64,${response.data}`},
      ]);

      const orientation = (response.exif as any)?.Orientation;
      console.log('orientation', orientation);
    },
    [images],
  );

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
        <Image style={styles.profileImage} source={profileImage} />
        <Text style={styles.profileImageText}>Change Profile Image</Text>
      </TouchableOpacity>
      <View style={styles.nicknameContainer}>
        <View style={styles.nickname}>
          <Text style={styles.nicknameLabel}>Nickname:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={nickname}
            onChangeText={nickname => setNickname(nickname)}
          />
        </View>

        <TouchableOpacity style={styles.nicknameChangeButton}>
          <Text style={styles.nicknameChangeButtonText}>save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alarmContainer}>
        <Text style={styles.modeLabel}>Alarm</Text>
        <Text style={styles.explainText}>알람을 활성화 합니다</Text>
        <Switch
          style={styles.modeSwitch}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={alarmMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleAlarmModeToggle}
          value={alarmMode}
        />
      </View>

      <View style={styles.darkModeContainer}>
        <Text style={styles.modeLabel}>Dark Mode</Text>
        <Text style={styles.explainText}>다크모드를 활성화 합니다</Text>
        <Switch
          style={styles.modeSwitch}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleDarkModeToggle}
          value={darkMode}
        />
      </View>

      <TouchableOpacity
        style={styles.settingContainer}
        onPress={toAlarmSetting}>
        <Text style={styles.toAlarmSettingText}>알람 설정</Text>
        <Text style={styles.explainText}>알람 설정 페이지로 이동합니다</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resignContainer}>
        <Text style={styles.resignText}>회원 탈퇴</Text>
        <Text style={styles.explainText}>계정을 삭제합니다</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 16,
    paddingBottom: 4,
  },

  nickname: {
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
