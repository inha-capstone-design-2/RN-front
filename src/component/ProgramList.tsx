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

let channelList = [];
let programList = [];
let bookmarkList = [];
let accessToken;

const ProgramList = () => {
  const navigation = useNavigation();
  const [currentChannel, setCurrentChannel] = useState(0);
  const [searchTarget, setSearchTarget] = useState('channel');
  const [searchText, setSearchText] = useState("");
  const [filteredChannel, setFilteredChannel] = useState(channelList);
  const [filteredProgram, setFilteredProgram] = useState(programList);
  const [noResult, setNoResult] = useState(false);
  const [bookmarkNum, setBookmarkNum] = useState(bookmarkList.length);
  const myId = useSelector((state: RootState) => state.user.userId);

  const initList = async () => {
    accessToken = await EncryptedStorage.getItem('accessToken');
    const cl = await EncryptedStorage.getItem('channelList');
    channelList = JSON.parse(cl);
    bookmarkSet();
    setFilteredChannel(channelList);
    programSet(channelList[0]);
  }

  useEffect(() => {
    initList();
  },[]);

  const toProgramDetail = (programId: number) => {
    navigation.navigate('ProgramDetail', {programId});
  };

  const programSet = async (item) => {
    setCurrentChannel(item.channelId);
    try {
      await customAxios
        .get(
          `/api/program/{channel-id}?channel-id=${item.channelId}`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        )
        .then(response => {
          const pl = JSON.stringify(response.data.data);
          setFilteredProgram(JSON.parse(pl));
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
          const bl = JSON.stringify(response.data.data);
          bookmarkList=JSON.parse(bl);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
    setBookmarkNum(bookmarkList.length);
  }

  const returnBookmark = (item) => {
    return bookmarkList.filter(bookmark => bookmark.programId==item.programId);
  }

  const handleBookmarkPress = async (item) => {
    const bookmark = returnBookmark(item);
    console.log(item.programId);
    if(bookmark.length == 0){
      try {
        await customAxios
          .post(
            `/api/bookmark/`,
            {
              memberId: myId,
              programId: item.programId
            },
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
    }
    else{
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
    }
    bookmarkSet();
  };

  const Channel = ({ item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity onPress={onPress} style={[styles.channelList, {backgroundColor}]}>
      <Text style={[styles.channelName, {color: textColor}]}>{item.channelName}</Text>
    </TouchableOpacity>
  );

  const Program = ({item, onPress}) => (
    <TouchableOpacity style={styles.programList} onPress={onPress}>
      <Text style={styles.programTitle}>{item.programTitle}</Text>
      <TouchableOpacity style={styles.bookmark} onPress={() => handleBookmarkPress(item)}>
          <FontAwesomeIcon
            id={item.programid}
            icon={faStar}
            size={26}
            style={returnBookmark(item).length != 0 ? styles.bookmarkStar : styles.unBookmarkStar}
          />
        </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderChannel = ({ item }) => {
    const backgroundColor = item.channelId === currentChannel ? '#4A3AFF' : '#EFF0F6';
    const color = item.channelId === currentChannel ? 'white' : 'black';
    return (
      <Channel 
        item={item}
        onPress={() => {programSet(item)}}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    )
  };

  const renderProgram = ({ item }) => (
    <Program item={item} onPress={() => toProgramDetail(item.programId)} bookmarkOnPress={() => addBookmark(item)} />
  );

  // useEffect(() => {
  //   if(searchTarget=='channel'){
  //     const filtered = channelList.filter(item => item.channelName.toLowerCase().includes(searchText.toLowerCase()));
  //     if(filtered.length==0) {
  //       setNoResult(true);
  //       setFilteredChannel(channelList);
  //     }
  //     else {
  //       setNoResult(false);
  //       setFilteredChannel(filtered);
  //     }
  //     setCurrentChannel(filteredChannel[0].channelId);
  //   }
  //   else if(searchTarget=='program'){
  //     const filtered = [];
  //     const filteredCh = [];
  //     for(let i=0;i<programList.length;i++){
  //       filtered[i]=programList[i].filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));
  //       if(filtered[i].length!=0) {
  //         filteredCh.push(channelList[i]);
  //       }
  //     }

  //     if(filteredCh.length==0) {
  //       setNoResult(true);
  //       setFilteredProgram(programList);
  //       setFilteredChannel(channelList);
  //     }
  //     else {
  //       setNoResult(false);
  //       setFilteredProgram(filtered);
  //       setFilteredChannel(filteredCh);
  //     }
  //     setCurrentChannel(filteredChannel[0].channelId);
  //   }
  // }, [searchText]);

  useEffect(() => {
    setFilteredChannel(channelList);
    setFilteredProgram(programList);
    setSearchText("");
  }, [searchTarget]);


  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <Picker
          style={styles.picker}
          mode="dropdown"
          selectedValue={searchTarget}
          onValueChange={(itemValue, itemIndex) =>
            setSearchTarget(itemValue)
          }
        >
          <Picker.Item label="채널" value="channel" />
          <Picker.Item label="프로그램" value="program" />
        </Picker>
        <TextInput 
          style={styles.input}
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          placeholder={searchTarget=='channel' ? "채널 이름으로 검색" : "프로그램 이름으로 검색"}
        />
      </View>
      <View style={styles.main}>
        <View style={styles.channel}>
          <FlatList
            data={filteredChannel}
            horizontal = {true}
            renderItem={renderChannel}
            keyExtractor={item => item.channelId}
            extraData={currentChannel}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View>
        </View>
        <View>
          {noResult ? (
            <Text>검색 결과가 없습니다</Text>
          ):(
            <FlatList
              data={filteredProgram}
              renderItem={renderProgram}
              keyExtractor={item => item.id}
              extraData={bookmarkList}
            />
          )
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

  search: {
    flex: 3,
    marginTop: 20,
    justifyContent: 'center',
  },

  main: {
    flex: 13,
  },

  picker: {
    marginHorizontal:5,
  },

  input: {
    backgroundColor: '#fff',
    width: 370,
    height: 55,
    borderWidth: 1,
    borderColor: "#EFF0F6",
    borderRadius: 46,
    fontSize: 16,
    color: "#6F6C90",
    paddingLeft: 18,
    marginHorizontal:10,
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
    //backgroundColor: '#EFF0F6',
    borderRadius: 30,
    margin: 5,
    padding: 1,
    justifyContent: 'center',
  },

  channelName: {
    textAlign: 'center',
    fontSize: 18,
    //color: "#170F49",
  },

  programList: {
    flexDirection: 'row',
    padding:15,
    borderBottomWidth:1,
    borderBottomColor: '#EFF0F6',
    justifyContent: 'space-between',
  },

  programTime: {
    fontSize: 15,
    margin: 5,
    textAlignVertical: 'center'
  },

  programTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlignVertical: 'center',
    marginLeft: 10,
    color: 'black',
  },

  bookmark: {
    
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
  }
});

export default ProgramList;