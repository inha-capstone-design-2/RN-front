import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {chatAxios} from '../utils/customAxios';

type Program = {
  program: string;
  broadcastor: string;
  startTime: Date;
};

type Broadcast = {
  [key: string]: Program[];
};

const ProgramBar = () => {
  let broadcast: Broadcast = {};
  const navigation = useNavigation();
  const [broadcasts, setBroadcasts] = useState<Broadcast>({});

  const toProgramDetail = (programId: number) => {
    navigation.navigate('ProgramDetail', {programId});
  };

  function extractTimeFromDate(dateString: string) {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return hours + '시 ' + minutes + '분';
  }

  useEffect(() => {
    const getPrograms = async () => {
      await chatAxios.get('/v1/broadcast/schedules').then(response => {
        const results = response.data.data;

        results.map((result: Program) => {
          const {program, broadcastor, startTime} = result;

          if (!broadcast[broadcastor]) {
            broadcast[broadcastor] = [];
          }

          broadcast[broadcastor].push({program, broadcastor, startTime});
        });
        setBroadcasts(broadcast);
      });
    };
    console.log(broadcasts);
    getPrograms();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {Object.keys(broadcasts).map(broadcaster => (
        <View style={styles.broadcasterContainer}>
          <Text style={styles.broadcasterTitle}>{broadcaster}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {broadcasts[broadcaster].map((program: Program) => (
              <TouchableOpacity style={styles.favoriteProgramContainer}>
                <Text style={styles.programTime}>{program.program}</Text>
                <Text style={styles.programTitle}>
                  {extractTimeFromDate(program.startTime.toString())}
                </Text>
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
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: 'white',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0000c8',
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
