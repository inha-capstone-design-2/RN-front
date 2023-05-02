import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
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
    console.log(userId);
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
