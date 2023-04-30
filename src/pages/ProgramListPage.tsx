import React, {useState, useEffect} from 'react';
import {
  View, 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput, 
  StatusBar, 
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import ProgramBar from '../component/ProgramBar';
import ProgramList from '../component/ProgramList';
import {Picker} from '@react-native-picker/picker';
import { findFocusedRoute } from '@react-navigation/native';

const channelList = [
  {
    id: '0',
    title: "KBS1",
  },
  {
    id: '1',
    title: "KBS2",
  },
  {
    id: '2',
    title: "MBC",
  },
  {
    id: '3',
    title: "EBS1",
  },
  {
    id: '4',
    title: "EBS2",
  },
  {
    id: '5',
    title: "SBS",
  },
];
const programList = [
  [
    {
      id: '1',
      channelName: "KBS1",      
      start: '05:00',
      end: '06:00',
      title: "우리 집 금송아지"
    },
    {
      id: '2',   
      channelName: "KBS1", 
      start: '06:00',
      end: '07:00',
      title: "KBS1 뉴스"
    },
    {
      id: '3',     
      channelName: "KBS1",
      start: '07:00',
      end: '08:00',
      title: "세계는 지금"
    },
    {
      id: '4',     
      channelName: "KBS1",
      start: '08:00',
      end: '09:00',
      title: "노래가 좋아"
    },
    {
      id: '5',     
      channelName: "KBS1",
      start: '09:00',
      end: '10:00',
      title: "TV비평 시청자 데스크"
    },
    {
      id: '6',     
      channelName: "KBS1",
      start: '10:00',
      end: '11:00',
      title: "TV쇼 진품명품"
    },
    {
      id: '7',     
      channelName: "KBS1",
      start: '11:00',
      end: '12:00',
      title: "전국노래자랑"
    },
    {
      id: '8',     
      channelName: "KBS1",
      start: '12:00',
      end: '13:00',
      title: "걸어서 세계속으로"
    },
    {
      id: '9',     
      channelName: "KBS1",
      start: '13:00',
      end: '14:00',
      title: "이웃집 찰스"
    },
    {
      id: '10',     
      channelName: "KBS1",
      start: '14:00',
      end: '15:00',
      title: "안녕 우리말"
    },
    {
      id: '11',     
      channelName: "KBS1",
      start: '15:00',
      end: '16:00',
      title: "장바구니 미리담기"
    },
    {
      id: '12',     
      channelName: "KBS1",
      start: '16:00',
      end: '17:00',
      title: "동물의 왕국"
    },
    {
      id: '13',     
      channelName: "KBS1",
      start: '17:00',
      end: '18:00',
      title: "런닝맨"
    },
    {
      id: '14',     
      channelName: "KBS1",
      start: '18:00',
      end: '19:00',
      title: "열린음악회"
    },
  ],
  [
    {
      id: '1',
      channelName: "KBS2",      
      start: '05:00',
      end: '06:00',
      title: "우리 집 금송아지"
    },
    {
      id: '2',   
      channelName: "KBS2", 
      start: '06:00',
      end: '07:00',
      title: "KBS2 뉴스"
    },
    {
      id: '3',     
      channelName: "KBS2",
      start: '07:00',
      end: '08:00',
      title: "세계는 지금"
    },
    {
      id: '4',     
      channelName: "KBS2",
      start: '08:00',
      end: '09:00',
      title: "노래가 좋아"
    },
    {
      id: '5',     
      channelName: "KBS2",
      start: '09:00',
      end: '10:00',
      title: "TV비평 시청자 데스크"
    },
    {
      id: '6',     
      channelName: "KBS2",
      start: '10:00',
      end: '11:00',
      title: "TV쇼 진품명품"
    },
    {
      id: '7',     
      channelName: "KBS2",
      start: '11:00',
      end: '12:00',
      title: "전국노래자랑"
    },
    {
      id: '8',     
      channelName: "KBS2",
      start: '12:00',
      end: '13:00',
      title: "걸어서 세계속으로"
    },
    {
      id: '9',     
      channelName: "KBS2",
      start: '13:00',
      end: '14:00',
      title: "이웃집 찰스"
    },
    {
      id: '10',     
      channelName: "KBS2",
      start: '14:00',
      end: '15:00',
      title: "안녕 우리말"
    },
    {
      id: '11',     
      channelName: "KBS2",
      start: '15:00',
      end: '16:00',
      title: "장바구니 미리담기"
    },
    {
      id: '12',     
      channelName: "KBS2",
      start: '16:00',
      end: '17:00',
      title: "동물의 왕국"
    },
    {
      id: '13',     
      channelName: "KBS2",
      start: '17:00',
      end: '18:00',
      title: "런닝맨"
    },
    {
      id: '14',     
      channelName: "KBS2",
      start: '18:00',
      end: '19:00',
      title: "열린음악회"
    },
  ],
  [
    {
      id: '1',
      channelName: "MBC",      
      start: '05:00',
      end: '06:00',
      title: "우리 집 금송아지"
    },
    {
      id: '2',   
      channelName: "MBC", 
      start: '06:00',
      end: '07:00',
      title: "MBC 뉴스"
    },
    {
      id: '3',     
      channelName: "MBC",
      start: '07:00',
      end: '08:00',
      title: "세계는 지금"
    },
    {
      id: '4',     
      channelName: "MBC",
      start: '08:00',
      end: '09:00',
      title: "노래가 좋아"
    },
    {
      id: '5',     
      channelName: "MBC",
      start: '09:00',
      end: '10:00',
      title: "TV비평 시청자 데스크"
    },
    {
      id: '6',     
      channelName: "MBC",
      start: '10:00',
      end: '11:00',
      title: "TV쇼 진품명품"
    },
    {
      id: '7',     
      channelName: "MBC",
      start: '11:00',
      end: '12:00',
      title: "전국노래자랑"
    },
    {
      id: '8',     
      channelName: "MBC",
      start: '12:00',
      end: '13:00',
      title: "걸어서 세계속으로"
    },
    {
      id: '9',     
      channelName: "MBC",
      start: '13:00',
      end: '14:00',
      title: "이웃집 찰스"
    },
    {
      id: '10',     
      channelName: "MBC",
      start: '14:00',
      end: '15:00',
      title: "안녕 우리말"
    },
    {
      id: '11',     
      channelName: "MBC",
      start: '15:00',
      end: '16:00',
      title: "장바구니 미리담기"
    },
    {
      id: '12',     
      channelName: "MBC",
      start: '16:00',
      end: '17:00',
      title: "동물의 왕국"
    },
    {
      id: '13',     
      channelName: "MBC",
      start: '17:00',
      end: '18:00',
      title: "런닝맨"
    },
    {
      id: '14',     
      channelName: "MBC",
      start: '18:00',
      end: '19:00',
      title: "열린음악회"
    },
  ],
  [
    {
      id: '1',
      channelName: "EBS1",      
      start: '05:00',
      end: '06:00',
      title: "우리 집 금송아지"
    },
    {
      id: '2',   
      channelName: "EBS1", 
      start: '06:00',
      end: '07:00',
      title: "EBS1 뉴스"
    },
    {
      id: '3',     
      channelName: "EBS1",
      start: '07:00',
      end: '08:00',
      title: "세계는 지금"
    },
    {
      id: '4',     
      channelName: "EBS1",
      start: '08:00',
      end: '09:00',
      title: "노래가 좋아"
    },
    {
      id: '5',     
      channelName: "EBS1",
      start: '09:00',
      end: '10:00',
      title: "TV비평 시청자 데스크"
    },
    {
      id: '6',     
      channelName: "EBS1",
      start: '10:00',
      end: '11:00',
      title: "TV쇼 진품명품"
    },
    {
      id: '7',     
      channelName: "EBS1",
      start: '11:00',
      end: '12:00',
      title: "전국노래자랑"
    },
    {
      id: '8',     
      channelName: "EBS1",
      start: '12:00',
      end: '13:00',
      title: "걸어서 세계속으로"
    },
    {
      id: '9',     
      channelName: "EBS1",
      start: '13:00',
      end: '14:00',
      title: "이웃집 찰스"
    },
    {
      id: '10',     
      channelName: "EBS1",
      start: '14:00',
      end: '15:00',
      title: "안녕 우리말"
    },
    {
      id: '11',     
      channelName: "EBS1",
      start: '15:00',
      end: '16:00',
      title: "장바구니 미리담기"
    },
    {
      id: '12',     
      channelName: "EBS1",
      start: '16:00',
      end: '17:00',
      title: "동물의 왕국"
    },
    {
      id: '13',     
      channelName: "EBS1",
      start: '17:00',
      end: '18:00',
      title: "런닝맨"
    },
    {
      id: '14',     
      channelName: "EBS1",
      start: '18:00',
      end: '19:00',
      title: "열린음악회"
    },
  ],
  [
    {
      id: '1',
      channelName: "EBS2",      
      start: '05:00',
      end: '06:00',
      title: "우리 집 금송아지"
    },
    {
      id: '2',   
      channelName: "EBS2", 
      start: '06:00',
      end: '07:00',
      title: "EBS2 뉴스"
    },
    {
      id: '3',     
      channelName: "EBS2",
      start: '07:00',
      end: '08:00',
      title: "세계는 지금"
    },
    {
      id: '4',     
      channelName: "EBS2",
      start: '08:00',
      end: '09:00',
      title: "노래가 좋아"
    },
    {
      id: '5',     
      channelName: "EBS2",
      start: '09:00',
      end: '10:00',
      title: "TV비평 시청자 데스크"
    },
    {
      id: '6',     
      channelName: "EBS2",
      start: '10:00',
      end: '11:00',
      title: "TV쇼 진품명품"
    },
    {
      id: '7',     
      channelName: "EBS2",
      start: '11:00',
      end: '12:00',
      title: "전국노래자랑"
    },
    {
      id: '8',     
      channelName: "EBS2",
      start: '12:00',
      end: '13:00',
      title: "걸어서 세계속으로"
    },
    {
      id: '9',     
      channelName: "EBS2",
      start: '13:00',
      end: '14:00',
      title: "이웃집 찰스"
    },
    {
      id: '10',     
      channelName: "EBS2",
      start: '14:00',
      end: '15:00',
      title: "안녕 우리말"
    },
    {
      id: '11',     
      channelName: "EBS2",
      start: '15:00',
      end: '16:00',
      title: "장바구니 미리담기"
    },
    {
      id: '12',     
      channelName: "EBS2",
      start: '16:00',
      end: '17:00',
      title: "동물의 왕국"
    },
    {
      id: '13',     
      channelName: "EBS2",
      start: '17:00',
      end: '18:00',
      title: "런닝맨"
    },
    {
      id: '14',     
      channelName: "EBS2",
      start: '18:00',
      end: '19:00',
      title: "열린음악회"
    },
  ],
  [
    {
      id: '1',
      channelName: "SBS",      
      start: '05:00',
      end: '06:00',
      title: "우리 집 금송아지"
    },
    {
      id: '2',   
      channelName: "SBS", 
      start: '06:00',
      end: '07:00',
      title: "SBS 뉴스"
    },
    {
      id: '3',     
      channelName: "SBS",
      start: '07:00',
      end: '08:00',
      title: "세계는 지금"
    },
    {
      id: '4',     
      channelName: "SBS",
      start: '08:00',
      end: '09:00',
      title: "노래가 좋아"
    },
    {
      id: '5',     
      channelName: "SBS",
      start: '09:00',
      end: '10:00',
      title: "TV비평 시청자 데스크"
    },
    {
      id: '6',     
      channelName: "SBS",
      start: '10:00',
      end: '11:00',
      title: "TV쇼 진품명품"
    },
    {
      id: '7',     
      channelName: "SBS",
      start: '11:00',
      end: '12:00',
      title: "전국노래자랑"
    },
    {
      id: '8',     
      channelName: "SBS",
      start: '12:00',
      end: '13:00',
      title: "걸어서 세계속으로"
    },
    {
      id: '9',     
      channelName: "SBS",
      start: '13:00',
      end: '14:00',
      title: "이웃집 찰스"
    },
    {
      id: '10',     
      channelName: "SBS",
      start: '14:00',
      end: '15:00',
      title: "안녕 우리말"
    },
    {
      id: '11',     
      channelName: "SBS",
      start: '15:00',
      end: '16:00',
      title: "장바구니 미리담기"
    },
    {
      id: '12',     
      channelName: "SBS",
      start: '16:00',
      end: '17:00',
      title: "동물의 왕국"
    },
    {
      id: '13',     
      channelName: "SBS",
      start: '17:00',
      end: '18:00',
      title: "런닝맨"
    },
    {
      id: '14',     
      channelName: "SBS",
      start: '18:00',
      end: '19:00',
      title: "열린음악회"
    },
  ],
]

const ProgramListPage = () => {
  const [showProgramBar, setShowProgramBar] = useState(false);
  const [currentChannel, setChannel] = useState(0);
  const [searchTarget, setSearchTarget] = useState('channel');
  const [searchText, setSearchText] = useState("");
  const [filteredChannel, setFilteredChannel] = useState(channelList);
  const [filteredProgram, setFilteredProgram] = useState(programList);
  const [noResult, setNoResult] = useState(false);

  const toggleShowProgramBar = () => {
    setShowProgramBar(true);
  };

  const toggleShowProgramList = () => {
    setShowProgramBar(false);
  };

  const Channel = ({ item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity onPress={onPress} style={[styles.channelList, {backgroundColor}]}>
      <Text style={[styles.channelName, {color: textColor}]}>{item.title}</Text>
    </TouchableOpacity>
  );

  const onPressChannel = (event) => {
    setChannel(event.nativeEvent.target.id);
  }

  const Program = ({start, end, title}) => (
    <TouchableOpacity style={styles.programList}>
      <Text style={styles.programTime}>{start}~{end}</Text>
      <Text style={styles.programTitle}>{title}</Text>
    </TouchableOpacity>
  )

  const renderChannel = ({ item }) => {
    const backgroundColor = parseInt(item.id) === currentChannel ? '#4A3AFF' : '#EFF0F6';
    const color = parseInt(item.id) === currentChannel ? 'white' : 'black';
    return (
      <Channel 
        item={item}
        onPress={() => setChannel(parseInt(item.id))}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    )
  };

  const renderProgram = ({ item }) => (
    <Program start={item.start} end={item.end} title={item.title} />
  );

  const searchChannel = ({searchText}) => {
    const filtered = channelList.filter(item => item.title.includes(searchText));
    if(filtered.length==0) setNoResult(true);
    else setFilteredChannel(filtered);
  }

  useEffect(() => {
    if(searchTarget=='channel'){
      const filtered = channelList.filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));
      if(filtered.length==0) {
        setNoResult(true);
        setFilteredChannel(channelList);
      }
      else {
        setNoResult(false);
        setFilteredChannel(filtered);
      }
      setChannel(parseInt(filteredChannel[0].id));
    }
    else if(searchTarget=='program'){
      const filtered = [];
      const filteredCh = [];
      for(let i=0;i<programList.length;i++){
        filtered[i]=programList[i].filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));
        if(filtered[i].length!=0) {
          filteredCh.push(channelList[i]);
        }
      }

      if(filteredCh.length==0) {
        setNoResult(true);
        setFilteredProgram(programList);
        setFilteredChannel(channelList);
      }
      else {
        setNoResult(false);
        setFilteredProgram(filtered);
        setFilteredChannel(filteredCh);
      }
      setChannel(parseInt(filteredChannel[0].id));
    }
  }, [searchText]);

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
        <View>
          <FlatList
            data={filteredChannel}
            horizontal = {true}
            renderItem={renderChannel}
            keyExtractor={item => item.id}
            extraData={currentChannel}
            showsHorizontalScrollIndicator={false}
          />
          <View style={styles.VertialLine}></View>
        </View>
        <View>
          {noResult ? (
            <Text>검색 결과가 없습니다</Text>
          ):(
            <FlatList
              data={filteredProgram[currentChannel]}
              renderItem={renderProgram}
              keyExtractor={item => item.id}
            />
          )
        }
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="ProgramBar"
          onPress={toggleShowProgramBar}
          buttonStyle={
            showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={
            showProgramBar
              ? styles.activeButtonTitle
              : styles.inactiveButtonTitle
          }
          containerStyle={styles.button}
        />
        <Button
          title="ProgramList"
          onPress={toggleShowProgramList}
          buttonStyle={
            !showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={
            !showProgramBar
              ? styles.activeButtonTitle
              : styles.inactiveButtonTitle
          }
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
    backgroundColor: 'gray',
    height: '100%',
  },
  inactiveButton: {
    backgroundColor: 'white',
    height: '100%',
  },
  activeButtonTitle: {
    color: 'white',
  },
  inactiveButtonTitle: {
    color: 'black',
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

  VertialLine: {
    borderBottomColor: '#EFF0F6',
    borderBottomWidth: 1,
    marginVertical: 15,
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
    margin: 10,
  },

  programTime: {
    fontSize: 15,
    margin: 5,
    textAlignVertical: 'center'
  },

  programTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlignVertical: 'center',
    marginLeft: 10,
  },
});

export default ProgramListPage;
