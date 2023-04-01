import React, {useState} from 'react';
import {View, Text, Switch, StyleSheet, TouchableOpacity} from 'react-native';

const alarms = [
  {id: 1, time: '08:00 AM', name: 'Drama Name', date: '2023-04-01'},
  {id: 2, time: '12:00 PM', name: 'Drama Name', date: '2023-04-01'},
  {id: 3, time: '06:00 PM', name: 'Drama Name', date: '2023-04-02'},
  {id: 4, time: '06:00 PM', name: 'Drama Name', date: '2023-04-02'},
  {id: 5, time: '06:00 PM', name: 'Drama Name', date: '2023-04-03'},
  {id: 6, time: '08:00 PM', name: 'Drama Name', date: '2023-04-03'},
  {id: 7, time: '10:00 PM', name: 'Drama Name', date: '2023-04-03'},
];

const groupByDate = alarms => {
  return alarms.reduce((acc, alarm) => {
    const date = alarm.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(alarm);
    return acc;
  }, {});
};

const AlarmSettingPage = () => {
  const [alarmSwitches, setAlarmSwitches] = useState(
    alarms.reduce((acc, alarm) => {
      acc[alarm.id] = false;
      return acc;
    }, {}),
  );

  const toggleSwitch = id => {
    setAlarmSwitches(prevSwitches => ({
      ...prevSwitches,
      [id]: !prevSwitches[id],
    }));
  };

  const groupedAlarms = groupByDate(alarms);

  return (
    <View style={styles.container}>
      {Object.entries(groupedAlarms).map(([date, alarms]) => (
        <View key={date}>
          <View style={styles.dateHeadingContainer}>
            <Text style={styles.dateHeading}>{date}</Text>
          </View>

          {alarms.map(alarm => (
            <View key={alarm.id} style={styles.alarmContainer}>
              <Text style={styles.timeText}>{alarm.time}</Text>
              <Text style={styles.alarmNameText}>{alarm.name}</Text>
              <View style={styles.alarmSetting}>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={alarmSwitches[alarm.id] ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => toggleSwitch(alarm.id)}
                  value={alarmSwitches[alarm.id]}
                />

                <TouchableOpacity>
                  <Text> x</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  alarmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alarmSetting: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmNameText: {
    fontSize: 16,
  },
  dateHeadingContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateHeading: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default AlarmSettingPage;
