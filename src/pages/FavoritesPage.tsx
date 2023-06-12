import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios, {AxiosError} from 'axios';
import {customAxios} from '../utils/customAxios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useIsFocused} from '@react-navigation/native';

type BookmarkedProgram = {
  id: number;
  programId: number;
  programTitle: string;
};

type IBookmarkedProgram = {
  item: BookmarkedProgram;
};

const windowWidth = Dimensions.get('window').width;

const ProgramList = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const navigation = useNavigation();
  const [bookmarkedProgramList, setBookmarkedProgramList] = useState<
    BookmarkedProgram[]
  >([]);

  const toProgramDetail = useCallback(
    (programId: number, programTitle: string) => {
      navigation.navigate('ProgramDetail', {
        programId,
        programTitle,
        isBookmarked: true,
      });
    },
    [],
  );

  const renderProgram = useCallback(({item}: IBookmarkedProgram) => {
    const {programId, programTitle} = item;

    return (
      <TouchableOpacity
        style={styles.programContainer}
        onPress={() => toProgramDetail(programId, programTitle)}>
        <Text style={styles.programTitle}>{programTitle}</Text>
      </TouchableOpacity>
    );
  }, []);

  useEffect(() => {
    const getFavorite = async () => {
      try {
        await customAxios
          .get(`/api/bookmark/`, {
            headers: {Authorization: `Bearer ${accessToken}`},
          })
          .then(response => {
            setBookmarkedProgramList(response.data.data);
          });
      } catch (error) {
        const errorResponse = (error as AxiosError).response as any;
        console.log(errorResponse?.data.error.code);
        Alert.alert('알림', `${errorResponse?.data.error.code}`);
      }
    };

    getFavorite();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.goBack}
            onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={30} />
          </TouchableOpacity>
          <Text style={styles.boardTitle}>즐겨찾기</Text>
        </View>
      </View>
      <ScrollView style={styles.main}>
        <View>
          {bookmarkedProgramList.length == 0 ? (
            <Text style={{borderTopWidth: 1, borderTopColor: '#EFF0F6'}}>
              즐겨찾기된 프로그램이 없습니다
            </Text>
          ) : (
            <FlatList data={bookmarkedProgramList} renderItem={renderProgram} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    width: windowWidth,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goBack: {
    paddingLeft: 16,
  },
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlignVertical: 'center',
    color: 'black',
  },

  main: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },

  programContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  programTitle: {
    fontSize: 14,
  },
});

export default ProgramList;
