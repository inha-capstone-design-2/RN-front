import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, ScrollView} from 'react-native';
import {Text} from 'react-native-elements';

import {LoggedInParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native';

type ArticlesPageProps = NativeStackScreenProps<LoggedInParamList, 'Articles'>;

type Article = {
  id: number;
  title: string;
  author: string;
  date: string;
  comments: number;
};

const ArticlesPage = ({navigation, route}: ArticlesPageProps) => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: '게시글 제목',
      author: 'asdh12234',
      date: '2022-01-06',
      comments: 3,
    },
    {
      id: 2,
      title: '게시글 제목',
      author: 'afdhadfh1323',
      date: '2022-01-04',
      comments: 1,
    },
    {
      id: 3,
      title: '게시글 제목',
      author: 'afgasedg12',
      date: '2022-01-03',
      comments: 0,
    },
    {
      id: 4,
      title: '게시글 제목',
      author: 'asdfh123',
      date: '2022-01-03',
      comments: 4,
    },
    {
      id: 5,
      title: '게시글 제목',
      author: 'aergae123',
      date: '2022-01-03',
      comments: 12,
    },
    {
      id: 6,
      title: '게시글 제목',
      author: 'heasrfa2',
      date: '2022-01-03',
      comments: 12,
    },
    {
      id: 7,
      title: '게시글 제목',
      author: '1232asdg',
      date: '2022-01-03',
      comments: 3,
    },
    {
      id: 8,
      title: '게시글 제목',
      author: '12323dasd',
      date: '2022-01-03',
      comments: 5,
    },
  ]);

  const toArticle = (articleId: number) => {
    navigation.navigate('Article', {articleId});
  };

  const renderArticles = () => {
    return articles.map(item => (
      <TouchableOpacity
        style={styles.articleContainer}
        key={item.id}
        onPress={() => toArticle(item.id)}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleMeta}>
          {item.author} | {item.date} | {item.comments}개의 댓글
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.boardTitle}>사랑의 이해 게시판</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.articleList}>
        {renderArticles()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  articleList: {
    flex: 1,
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
