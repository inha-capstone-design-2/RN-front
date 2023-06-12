import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import ProgramBar from '../component/ProgramBar';
import ProgramList from '../component/ProgramList';

const ProgramListPage = () => {
  const [showProgramBar, setShowProgramBar] = useState(true);

  const toggleShowProgramBar = () => {
    setShowProgramBar(true);
  };

  const toggleShowProgramList = () => {
    setShowProgramBar(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="시간표로 보기"
          onPress={toggleShowProgramBar}
          buttonStyle={
            showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={styles.ButtonTitle}
          containerStyle={styles.button}
        />
        <Button
          title="리스트로 보기"
          onPress={toggleShowProgramList}
          buttonStyle={
            !showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={styles.ButtonTitle}
          containerStyle={styles.button}
        />
      </View>
      {showProgramBar ? <ProgramBar /> : <ProgramList />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
  },
  button: {
    flex: 1,
    width: '50%',
  },
  activeButton: {
    backgroundColor: '#4E5BF6',
    height: '90%',
    borderRadius: 45,
    marginHorizontal: '4%',
  },
  inactiveButton: {
    backgroundColor: '#A6A6A6',
    height: '90%',
    borderRadius: 45,
    marginHorizontal: '4%',
  },
  ButtonTitle: {
    color: 'white',
  },
});

export default ProgramListPage;
