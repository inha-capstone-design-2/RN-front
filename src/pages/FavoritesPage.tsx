import React, {useState, useEffect} from 'react';
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
import { useIsFocused } from '@react-navigation/native'

type Channel = {
  channelId: number;
  channelName: string;
  createdTime: string;
  createdBy: number;
  updatedTime: string;
  updatedBy: number;
};

type Program = {
  programId: number;
  programTitle: string;
  channelId: number;
};

type Bookmark = {
  id: number;
  programId: number;
  createdTime: string;
  updatedTime: string;
};

let channelList = [];
let programList = [];
let bookmarkList = [];
const windowWidth = Dimensions.get('window').width;

const ProgramList = () => {
  const navigation = useNavigation();
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [programList, setProgramList] = useState<Program[]>([]);
  const [bookmarkList, setBookmarkList] = useState<Bookmark[]>([]);
  const [bookmarkedProgramList, setBookmarkedProgramList] = useState<Program[]>([]);
  const myId = useSelector((state: RootState) => state.user.userId);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isFocused = useIsFocused();

  const initList = async () => {
    channelSet();
    bookmarkSet();
    programSet();
  }

  useEffect(() => {
    initList();
  },[isFocused]);

  useEffect(() => {
    setBookmarkedProgramList(programList.filter((program) => {
      for(let i = 0;i<bookmarkList.length;i++) {
        if(program.programId==bookmarkList[i].programId) return true;
      }
      return false;
    }));
  },[bookmarkList, programList]);

  const toProgramDetail = (programId: number, item) => {
    const isBookmarked = true;
    navigation.navigate('ProgramDetail', {programId, isBookmarked});
  };

  const channelSet = async() => {
    try {
      await customAxios
        .get(
          `/api/channel/`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        )
        .then(response => {
          setChannelList(response.data.data);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  }

  const programSet = async () => {
    try {
      await customAxios
        .get(
          `/api/program/`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        )
        .then(response => {
          setProgramList(response.data.data);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  };

  const bookmarkSet = async () => {
    try {
      await customAxios
        .get(
          `/api/bookmark/`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        )
        .then(response => {
          setBookmarkList(response.data.data);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  };

  const returnBookmark = (item) => {
    return bookmarkList.filter(bookmark => bookmark.programId==item.programId);
  };

  const handleBookmarkPress = async (item) => {
    const bookmark = returnBookmark(item);
    try {
      await customAxios
        .delete(
          `/api/bookmark/{bookmark-id}?bookmark-id=${bookmark[0].id}`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        )
        .then(response => {
          console.log(response.data);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
    programSet();
    bookmarkSet();
  };

  const Program = ({item, onPress}) => (
    <TouchableOpacity style={styles.programList} onPress={onPress}>
      <View style={styles.programInfo}>
        <Text style={styles.programTitle}>{channelList.filter((channel) => channel.channelId == item. channelId)[0].channelName}</Text>
        <Text style={styles.programTitle}>{item.programTitle}</Text>
      </View>
      <TouchableOpacity style={styles.bookmark} onPress={() => handleBookmarkPress(item)}>
          <FontAwesomeIcon
            icon={faStar}
            size={26}
            style={styles.bookmarkStar}
          />
        </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderProgram = ({ item }) => (
    <Program item={item} onPress={() => toProgramDetail(item.programId, item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={styles.goBack}onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.boardTitle}>즐겨찾기</Text>
        </View>
      </View>
      <View style={styles.main}>
        <View>
          {bookmarkList.length == 0 ? 
            <Text style={{borderTopWidth:1,borderTopColor:'#EFF0F6'}}>즐겨찾기된 프로그램이 없습니다</Text> 
            :
            <FlatList
              data={bookmarkedProgramList}
              renderItem={renderProgram}
              keyExtractor={item => String(item.programId)}
              extraData={programList}
            />
          }
        </View>
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
    paddingLeft:16,
  },
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    //width: windowWidth - 100,
    textAlignVertical: 'center',
    color: 'black',
  },
  main: {
    flex: 13,
  },

  programList: {
    flexDirection: 'row',
    padding:15,
    width: windowWidth,
    borderBottomWidth:1,
    borderBottomColor: '#EFF0F6',
    justifyContent: 'space-between',
  },

  programTime: {
    fontSize: 15,
    margin: 5,
    textAlignVertical: 'center'
  },

  programInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  programTitle: {
    fontWeight: 'bold',
    fontSize: 20,
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
});

export default ProgramList;