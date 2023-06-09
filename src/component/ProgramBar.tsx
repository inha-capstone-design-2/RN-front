import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type Program = {
  programId: number;
  time: string;
  title: string;
  favorite: boolean;
};

const ProgramBar = () => {
  const navigation = useNavigation();

  const toProgramDetail = (programId: number) => {
    navigation.navigate('ProgramDetail', {programId});
  };

  const programs = {
    SBS: [
      {programId: 1, time: '00:00', title: '낭만닥터 김사부', favorite: true},
      {programId: 2, time: '02:00', title: '꽃선비 열애사', favorite: true},
      {programId: 3, time: '04:00', title: '모범택시 2', favorite: false},
      {programId: 4, time: '06:00', title: '트롤리', favorite: false},
    ],
    KBS: [
      {programId: 11, time: '00:00', title: '가슴이 뛴다', favorite: true},
      {
        programId: 12,
        time: '01:00',
        title: '어쩌다 마주친, 그대',
        favorite: false,
      },
      {programId: 13, time: '03:00', title: '진짜가 나타났다', favorite: false},
      {programId: 14, time: '05:00', title: '금이야 옥이야', favorite: false},
    ],
    JTBC: [
      {programId: 31, time: '00:00', title: '비밀의 여자', favorite: true},
      {programId: 32, time: '01:00', title: '닥터 차정숙', favorite: false},
      {programId: 33, time: '03:00', title: '나쁜 엄마', favorite: true},
      {programId: 34, time: '05:00', title: '신성한 이혼', favorite: false},
    ],
    KBC: [
      {programId: 41, time: '00:00', title: '듣고 보니 그럴싸', favorite: true},
      {programId: 42, time: '02:00', title: '대행사', favorite: false},
      {programId: 43, time: '04:00', title: '인사이더', favorite: false},
      {programId: 44, time: '06:00', title: '공작도시', favorite: false},
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {Object.keys(programs).map(broadcaster => (
        <View style={styles.broadcasterContainer}>
          <Text style={styles.broadcasterTitle}>{broadcaster}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {programs[broadcaster].map((program: Program) => (
              <TouchableOpacity
                onPress={() => toProgramDetail(program.programId)}
                style={
                  program.favorite
                    ? styles.favoriteProgramContainer
                    : styles.programContainer
                }>
                <Text style={styles.programTime}>{program.time}</Text>
                <Text style={styles.programTitle}>{program.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  broadcasterContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    height: 120,
  },
  broadcasterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  programContainer: {
    width: 100,
    height: 80,
    backgroundColor: 'white',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  favoriteProgramContainer: {
    width: 100,
    height: 80,
    backgroundColor: 'white',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9acd32',
  },
  programTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  programTitle: {
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ProgramBar;
