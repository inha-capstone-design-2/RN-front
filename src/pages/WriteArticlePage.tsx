import React, {useCallback, useEffect, useState} from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {Button} from 'react-native-elements';
import {customAxios} from '../utils/customAxios';
import {AxiosError} from 'axios';

type WriteArticlePageProps = NativeStackScreenProps<
  LoggedInParamList,
  'WriteArticle'
>;

function WriteArticlePage({navigation, route}: WriteArticlePageProps) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const {programId} = route.params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submitArticle = async () => {
    try {
      await customAxios
        .post(
          `/api/bbs/article`,
          {
            boardId: programId,
            content: content,
            memberId: userId,
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
      <TextInput
        style={styles.title}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.content}
        placeholder="내용을 입력하세요"
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity onPress={submitArticle}>
        <Text style={styles.submit}>게시글 작성</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontWeight: 'bold',
    alignSelf: 'stretch',
    height: 55,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    fontSize: 18,
    color: '#6F6C90',
    paddingHorizontal: 10,
    margin: 10,
  },

  content: {
    flex: 8,
    fontSize: 14,
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
