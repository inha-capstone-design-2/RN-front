import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const ProgramBar = () => {
  const programs = {
    SBS: [
      {time: '00:00', title: 'Program A', favorite: false},
      {time: '02:00', title: 'Program B', favorite: false},
      {time: '04:00', title: 'Program C', favorite: false},
      {time: '06:00', title: 'Program D', favorite: true},
    ],
    KBS: [
      {time: '00:00', title: 'Program A', favorite: true},
      {time: '01:00', title: 'Program B', favorite: false},
      {time: '03:00', title: 'Program C', favorite: false},
      {time: '05:00', title: 'Program D', favorite: false},
    ],
    SPOTV: [
      {time: '00:00', title: 'Program A', favorite: false},
      {time: '02:00', title: 'Program B', favorite: false},
      {time: '04:00', title: 'Program C', favorite: false},
      {time: '06:00', title: 'Program D', favorite: false},
    ],
    JTBC: [
      {time: '00:00', title: 'Program A', favorite: true},
      {time: '01:00', title: 'Program B', favorite: false},
      {time: '03:00', title: 'Program C', favorite: true},
      {time: '05:00', title: 'Program D', favorite: false},
    ],
    KBC: [
      {time: '00:00', title: 'Program A', favorite: true},
      {time: '02:00', title: 'Program B', favorite: false},
      {time: '04:00', title: 'Program C', favorite: false},
      {time: '06:00', title: 'Program D', favorite: false},
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {Object.keys(programs).map(broadcaster => (
        <View style={styles.broadcasterContainer}>
          <Text style={styles.broadcasterTitle}>{broadcaster}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {programs[broadcaster].map(program => (
              <View
                style={
                  program.favorite
                    ? styles.favoriteProgramContainer
                    : styles.programContainer
                }>
                <Text style={styles.programTime}>{program.time}</Text>
                <Text style={styles.programTitle}>{program.title}</Text>
              </View>
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
