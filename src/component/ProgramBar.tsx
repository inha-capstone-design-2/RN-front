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
      {programId: 1, time: '00:00', title: 'Program A', favorite: false},
      {programId: 2, time: '02:00', title: 'Program B', favorite: false},
      {programId: 3, time: '04:00', title: 'Program C', favorite: false},
      {programId: 4, time: '06:00', title: 'Program D', favorite: true},
    ],
    KBS: [
      {programId: 11, time: '00:00', title: 'Program A', favorite: true},
      {programId: 12, time: '01:00', title: 'Program B', favorite: false},
      {programId: 13, time: '03:00', title: 'Program C', favorite: false},
      {programId: 14, time: '05:00', title: 'Program D', favorite: false},
    ],
    SPOTV: [
      {programId: 21, time: '00:00', title: 'Program A', favorite: false},
      {programId: 22, time: '02:00', title: 'Program B', favorite: false},
      {programId: 23, time: '04:00', title: 'Program C', favorite: false},
      {programId: 24, time: '06:00', title: 'Program D', favorite: false},
    ],
    JTBC: [
      {programId: 31, time: '00:00', title: 'Program A', favorite: true},
      {programId: 32, time: '01:00', title: 'Program B', favorite: false},
      {programId: 33, time: '03:00', title: 'Program C', favorite: true},
      {programId: 34, time: '05:00', title: 'Program D', favorite: false},
    ],
    KBC: [
      {programId: 41, time: '00:00', title: 'Program A', favorite: true},
      {programId: 42, time: '02:00', title: 'Program B', favorite: false},
      {programId: 43, time: '04:00', title: 'Program C', favorite: false},
      {programId: 44, time: '06:00', title: 'Program D', favorite: false},
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
    fontSize: 14,
  },
});

export default ProgramBar;
