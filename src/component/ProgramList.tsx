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
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios, {AxiosError} from 'axios';
import {customAxios} from '../utils/customAxios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useIsFocused} from '@react-navigation/native';

type Channel = {
  channelId: number;
  channelName: string;
  createdTime?: string;
  createdBy?: number;
  updatedTime?: string;
  updatedBy?: number;
};

type Program = {
  programId: number;
  programTitle: string;
  channelId: number;
};

type IProgram = {
  item: Program;
};

const ProgramList = () => {
  const navigation = useNavigation();
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [programList, setProgramList] = useState<Program[]>([]);
  const [currentChannel, setCurrentChannel] = useState(0);
  const [searchTarget, setSearchTarget] = useState('channel');
  const [searchText, setSearchText] = useState('');
  const [filteredChannel, setFilteredChannel] = useState(channelList);
  const [filteredProgram, setFilteredProgram] = useState(programList);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isFocused = useIsFocused();

  useEffect(() => {
    const initList = async () => {
      await programSet(channelList[0].channelId);
    };
    initList();
  }, [channelList]);

  useEffect(() => {
    const channelSet = async () => {
      try {
        await customAxios
          .get(`/api/channel/`, {
            headers: {Authorization: `Bearer ${accessToken}`},
          })
          .then(response => {
            setChannelList(response.data.data);
            setFilteredChannel(channelList);
          });
      } catch (error) {
        const errorResponse = (error as AxiosError).response as any;
        console.log(errorResponse?.data.error.code);
        Alert.alert('알림', `${errorResponse?.data.error.code}`);
      }
    };
    channelSet();
  }, []);

  const programSet = async (channelId: number) => {
    setCurrentChannel(channelId);
    try {
      await customAxios
        .get(`/api/program/{channel-id}?channel-id=${channelId}`, {
          headers: {Authorization: `Bearer ${accessToken}`},
        })
        .then(response => {
          console.log(response.data.data);
          setProgramList(response.data.data);
          setFilteredProgram(programList);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  };

  const Channel = ({item, onPress, backgroundColor}: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.channelList, {backgroundColor}]}>
      <Text style={[styles.channelName]}>{item.channelName}</Text>
    </TouchableOpacity>
  );

  const renderChannel = ({item}: any) => {
    const backgroundColor =
      item.channelId === currentChannel ? '#4E5BF6' : '#A6A6A6';
    return (
      <Channel
        item={item}
        onPress={() => {
          programSet(item.channelId);
        }}
        backgroundColor={backgroundColor}
      />
    );
  };

  const toProgramDetail = (programId: number, programTitle: string) => {
    navigation.navigate('ProgramDetail', {
      programId,
      programTitle,
      isBookmarked: true,
    });
  };

  const renderProgram = useCallback(({item}: IProgram) => {
    const {programId, programTitle} = item;

    const isBookmarked = true;
    return (
      <TouchableOpacity
        style={styles.programList}
        onPress={() => toProgramDetail(programId, programTitle)}>
        <Text style={styles.programTitle}>{programTitle}</Text>
      </TouchableOpacity>
    );
  }, []);

  useEffect(() => {
    setFilteredChannel(channelList);
    setFilteredProgram(programList);
    setSearchText('');
  }, [searchTarget]);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <Picker
          style={styles.picker}
          mode="dropdown"
          selectedValue={searchTarget}
          onValueChange={(itemValue, itemIndex) => setSearchTarget(itemValue)}>
          <Picker.Item label="채널" value="channel" />
          <Picker.Item label="프로그램" value="program" />
        </Picker>
        <TextInput
          style={styles.input}
          onChangeText={text => setSearchText(text)}
          value={searchText}
          placeholder={
            searchTarget == 'channel'
              ? '채널 이름으로 검색'
              : '프로그램 이름으로 검색'
          }
        />
      </View>
      <View style={styles.main}>
        <View style={styles.channel}>
          <FlatList
            data={channelList}
            horizontal={true}
            renderItem={renderChannel}
            keyExtractor={item => String(item.channelId)}
            extraData={currentChannel}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View></View>
        <ScrollView style={styles.program}>
          <FlatList
            data={programList}
            renderItem={renderProgram}
            keyExtractor={item => String(item.programId)}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },

  search: {
    flex: 3,
    marginTop: 20,
    justifyContent: 'center',
  },

  main: {
    flex: 13,
  },

  picker: {
    marginHorizontal: 5,
  },

  input: {
    backgroundColor: '#fff',
    width: 370,
    height: 55,
    borderWidth: 1,
    borderColor: '#A6A6A6',
    borderRadius: 46,
    fontSize: 16,
    color: '#6F6C90',
    paddingLeft: 18,
    marginHorizontal: 10,
    marginBottom: 10,
  },

  channel: {
    width: 400,
    height: 55,
    margin: 5,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },

  channelList: {
    width: 70,
    height: 40,
    borderRadius: 30,
    margin: 5,
    padding: 1,
    justifyContent: 'center',
  },

  channelName: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
  },

  program: {
    padding: 16,
  },

  programList: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 8, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 4,
  },

  programTitle: {
    fontSize: 16,
    textAlignVertical: 'center',
    marginLeft: 10,
    color: 'black',
  },

  bookmarkStar: {
    color: '#ffd700',
  },
  unBookmarkStar: {
    color: '#d3d3d3',
  },

  logo: {
    width: 300,
    //height: 50,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default ProgramList;
