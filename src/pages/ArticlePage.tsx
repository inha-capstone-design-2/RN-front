import React, {useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LoggedInParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type ArticlePageProps = NativeStackScreenProps<LoggedInParamList, 'Article'>;

const ArticlePage = () => {
  const [articleData, setArticleData] = useState({
    title: '너무 재미있지 않나요?',
    author: 'asdfas123',
    date: '2023-04-23',
    content: '사랑의 이해 너무 재밌는 것 같아요~~',
    comments: [
      {
        author: 'awiemf123',
        date: '2023-04-22',
        content: '저두요',
      },
      {
        author: 'asdv23',
        date: '2023-04-21',
        content: '저두 그렇게 생각합니다!',
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.articleTitle}>{articleData.title}</Text>
      <View style={styles.articleMeta}>
        <Image
          source={{uri: 'https://picsum.photos/40'}}
          style={styles.authorAvatar}
        />
        <Text style={styles.authorName}>{articleData.author}</Text>
        <Text style={styles.articleDate}>{articleData.date}</Text>
      </View>

      <ScrollView>
        <Text style={styles.articleContent}>{articleData.content}</Text>
        {/* <View style={styles.commentInfoContainer}>
          <View style={styles.commentIconContainer}>
            <Icon name="comment" size={20} color="gray" />
          </View>
          <Text style={styles.commentCount}>2</Text>
        </View>
        <View /> */}
        {articleData.comments.map((comment, index) => (
          <View key={index} style={styles.comment}>
            <View style={styles.commentTop}>
              <Text style={styles.commentAuthor}>{comment.author}</Text>
              <Text style={styles.commentDate}>{comment.date}</Text>
            </View>

            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  articleDate: {
    marginLeft: 'auto',
    fontSize: 14,
    color: '#666',
  },
  articleContent: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 20,
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
    color: 'gray',
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
    color: '#666',
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ArticlePage;
