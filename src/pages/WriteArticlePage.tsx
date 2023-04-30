import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import {TouchableOpacity} from 'react-native-gesture-handler';
import axios from 'axios';
// import SERVER_URL from '../api';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {Button} from 'react-native-elements';

const Stack = createNativeStackNavigator();

type WriteArticlePageProps = NativeStackScreenProps<
  LoggedInParamList,
  'WriteArticle'
>;

function WriteArticlePage({navigation, route}: WriteArticlePageProps) {
  const userId = useSelector((state: RootState) => state.user.userId);
  const {programId} = route.params;

  console.log(userId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  //   const submitArticle = useCallback(() => {
  //     console.log(userId);
  //     // axios.post(`${SERVER_URL}/api/bbs/article/`, {
  //     //   boardId: 1,
  //     //   content: content,
  //     //   memberId: 2,
  //     // });
  //   }, [title, content, userId]);

  const submitArticle = async () => {
    await axios
      .post('/api/bbs/article', {
        boardId: programId,
        content: content,
        memberId: userId,
        title: title,
      })
      .then(response => {
        // 에러 낫을 경우 여기로 들어오지 않음
        Alert.alert('게시글 작성완료!');
        navigation.goBack();
        console.log('응답:', response.data);
      });
  };

  return (
    <View>
      <View>
        <TextInput placeholder="제목" value={title} onChangeText={setTitle} />
        <TextInput
          placeholder="내용"
          value={content}
          onChangeText={setContent}
          multiline={true}
        />
      </View>

      <View>
        <Button onPress={submitArticle} title="작성완료"></Button>
      </View>
    </View>
  );
}

export default WriteArticlePage;
