import React, {useCallback, useEffect, useState} from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {Button} from 'react-native-elements';
import {customAxios} from '../utils/customAxios';
import {AxiosError} from 'axios';
import { useIsFocused } from '@react-navigation/native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

type WriteArticlePageProps = NativeStackScreenProps<
  LoggedInParamList,
  'WriteArticle'
>;

const windowWidth = Dimensions.get('window').width;

function WriteArticlePage({navigation, route}: WriteArticlePageProps) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const {boardId, boardTitle} = route.params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submitArticle = async () => {
    console.log(boardId);
    try {
      await customAxios
        .post(
          `/api/bbs/article/`,
          {
            boardId: boardId,
            content: content,
            title: title,
          },
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        )
        .then(response => {
          Alert.alert('게시글 작성완료!');
          navigation.goBack();
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={styles.goBack} onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.boardTitle}>{boardTitle}</Text>
        </View>
        <TouchableOpacity onPress={() => submitArticle()}>
          <Text style={styles.write}>완료</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.title}
        placeholder="제목"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.content}
        placeholder="내용을 입력하세요"
        value={content}
        onChangeText={(text) => setContent(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'black',

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
  title: {
    fontWeight: 'bold',
    alignSelf: 'stretch',
    height: 55,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    fontSize: 20,
    color: '#6F6C90',
    paddingHorizontal: 10,
    margin: 10,
  },

  content: {
    flex: 8,
    fontSize: 18,
    alignSelf: 'stretch',
    margin:10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },

  submit: {
    backgroundColor: '#4A3AFF',
    width: 350,
    height: 55,
    borderRadius: 46,
    fontSize: 18,
    color: '#fff',
    margin: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default WriteArticlePage;
