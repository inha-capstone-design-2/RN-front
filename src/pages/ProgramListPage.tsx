import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import ProgramBar from '../component/ProgramBar';
import ProgramList from '../component/ProgramList';
import {customAxios} from '../utils/customAxios';
import axios, {AxiosError} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

const ProgramListPage = () => {
  const [showProgramBar, setShowProgramBar] = useState(true);

  const toggleShowProgramBar = () => {
    setShowProgramBar(true);
  };

  const toggleShowProgramList = () => {
    setShowProgramBar(false);
  };

  useEffect(()=>{
    const initChannelList = async () => {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      try {
        await customAxios
          .get(
            `/api/channel/`,
            {
              headers: {Authorization: `Bearer ${accessToken}`},
            },
          )
          .then(response => {
            EncryptedStorage.setItem(
              'channelList',
               JSON.stringify(response.data.data),
            );
          });
      } catch (error) {
        const errorResponse = (error as AxiosError).response as any;
        console.log(errorResponse?.data.error.code);
        Alert.alert('알림', `${errorResponse?.data.error.code}`);
      }
    }
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="ProgramBar"
          onPress={toggleShowProgramBar}
          buttonStyle={
            showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={styles.ButtonTitle}
          containerStyle={styles.button}
        />
        <Button
          title="ProgramList"
          onPress={toggleShowProgramList}
          buttonStyle={
            !showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={styles.ButtonTitle}
          containerStyle={styles.button}
        />
      </View>
      {showProgramBar ? <ProgramBar /> : <ProgramList />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
  },
  button: {
    flex: 1,
    width: '50%',
  },
  activeButton: {
    backgroundColor: '#4E5BF6',
    height: '90%',
    borderRadius: 45,
    marginHorizontal:'4%',
  },
  inactiveButton: {
    backgroundColor: '#A6A6A6',
    height: '90%',
    borderRadius: 45,
    marginHorizontal:'4%',
  },
  ButtonTitle: {
    color: 'white',
  },
});

export default ProgramListPage;
