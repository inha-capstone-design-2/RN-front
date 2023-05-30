import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LoggedInParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import axios, {AxiosError} from 'axios';
import {customAxios} from '../utils/customAxios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import { useIsFocused } from '@react-navigation/native'

type ArticlePageProps = NativeStackScreenProps<LoggedInParamList, 'Article'>;

const windowWidth = Dimensions.get('window').width;
let article ={};

const ArticlePage = ({navigation, route}: ArticlePageProps) => {
  const {articleId, boardTitle} = route.params;
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isFocused = useIsFocused();

  const [articleData, setArticleData] = useState({
    title: '너무 재미있지 않나요?',
    author: 'asdfas123',
    date: '2023-04-23',
    content: '사랑의 이해 너무 재밌는 것 같아요~~',
  });

  const getArticle = async () => {
    try {
      await customAxios
        .get(`/api/bbs/article/{article-id}?article-id=${articleId}`, 
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          }
        )
        .then(response => {
          article = JSON.parse(JSON.stringify(response.data.data));
          console.log(article);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  }

  useEffect(() => {
    getArticle();
  }, [articleId,isFocused]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }

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
          <Text style={styles.boardTitle}>{boardTitle}</Text>
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.articleMeta}>
          <Image
            source={{uri: 'https://picsum.photos/40'}}
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>{article.createdBy}</Text>
          <Text style={styles.articleDate}>{formatDateTime(article.createdTime)}</Text>
        </View>
        <Text style={styles.articleTitle}>{article.title}</Text>

        <ScrollView>
          <Text style={styles.articleContent}>{article.content}</Text>
          {/* <View style={styles.commentInfoContainer}>
            <View style={styles.commentIconContainer}>
              <Icon name="comment" size={20} color="gray" />
            </View>
            <Text style={styles.commentCount}>2</Text>
          </View>
          <View /> */}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    color: 'black',
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
    margin: 20,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  articleDate: {
    marginLeft: 'auto',
    fontSize: 14,
  },
  articleContent: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 20,
    color: 'black',
  },
  commentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  commentIconContainer: {
    width: 30,
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: 5,
    fontSize: 16,
  },

  comment: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ArticlePage;
