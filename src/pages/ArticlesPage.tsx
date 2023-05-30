import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, ScrollView, Alert, Dimensions, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import {LoggedInParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios, {AxiosError} from 'axios';
import {customAxios} from '../utils/customAxios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import { useIsFocused } from '@react-navigation/native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';


type ArticlesPageProps = NativeStackScreenProps<LoggedInParamList, 'Articles'>;

type Article = {
  id: number;
  title: string;
  author: string;
  date: string;
  comments: number;
};

let articles = [];
let board = {};
const windowWidth = Dimensions.get('window').width;

const ArticlesPage = ({navigation, route}: ArticlesPageProps) => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const myId = useSelector((state: RootState) => state.user.userId);
  const myNickname = useSelector((state: RootState) => state.user.nickname);
  const {programId} = route.params;
  const isFocused = useIsFocused();
  

  const toArticle = (articleId: number) => {
    const boardTitle = board.name;
    navigation.navigate('Article', {articleId, boardTitle});
  };

  const writeArticle = (programId: number) => {
    const boardId = board.id;
    const boardTitle = board.name;
    navigation.navigate('WriteArticle', {boardId, boardTitle});
  };

  const getBoard =async () => {
    try {
      await customAxios
        .get(`/api/bbs/board/`, 
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          }
        )
        .then(response => {
          board = JSON.parse(JSON.stringify(response.data.data)).filter((item)=>item.programId==programId)[0];
          console.log("board set");
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  }

  const getArticles = async () => {
    try {
      await customAxios
        .get(`/api/bbs/article/{board-id}?board-id=${board.id}`, 
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          }
        )
        .then(response => {
          articles = JSON.parse(JSON.stringify(response.data.data));
          console.log(articles);
          console.log(articles.length);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  }

  useEffect(() => {
    getBoard();
    getArticles();
  }, [programId,isFocused]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }

  const getNickname = async (memberId) => {
    let nickname: string;
    try {
      await customAxios
        .get(`/api/member/{member-id}?member-id=${memberId}`, 
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          }
        )
        .then(response => {
          nickname = JSON.parse(JSON.stringify(response.data.data)).nickname;
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  }

  const Article = ({ item, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.articleList}>
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleMeta}>
          {item.createdBy} | {formatDateTime(item.createdTime)}
      </Text>
    </TouchableOpacity>
  );

  const onPressBack = () => {
    navigation.goBack();
  }

  const renderArticles = ({ item }) => {
    return (
      <Article 
        item={item}
        onPress={() => {toArticle(item.id)}}
      />
    )
  };

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
          <Text style={styles.boardTitle}>{board.name}</Text>
        </View>
        <TouchableOpacity onPress={() => writeArticle(board.id)}>
          <Text style={styles.write}>글 쓰기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.article}>
        {
          articles.length == 0 ?
          <Text style={{textAlign: 'center'}}>게시글이 없습니다.</Text>
          :
          <FlatList
          data={articles}
          renderItem={renderArticles}
          keyExtractor={item => item.id}
          //extraData={}
        />
        }
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

  },
  write: {
    backgroundColor: '#4A3AFF',
    borderRadius: 30,
    margin: 15,
    padding: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
    color: '#fff',
    width: 80,
    height: 40,
  },
  articleList: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: windowWidth,
    padding: 15,
  },
  articleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  articleMeta: {
    color: '#999',
  },
});

export default ArticlesPage;
