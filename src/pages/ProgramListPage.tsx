import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import ProgramBar from '../component/ProgramBar';
import ProgramList from '../component/ProgramList';

const ProgramListPage = () => {
  const [showProgramBar, setShowProgramBar] = useState(false);

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
          title="ProgramBar"
          onPress={toggleShowProgramBar}
          buttonStyle={
            showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={
            showProgramBar
              ? styles.activeButtonTitle
              : styles.inactiveButtonTitle
          }
          containerStyle={styles.button}
        />
        <Button
          title="ProgramList"
          onPress={toggleShowProgramList}
          buttonStyle={
            !showProgramBar ? styles.activeButton : styles.inactiveButton
          }
          titleStyle={
            !showProgramBar
              ? styles.activeButtonTitle
              : styles.inactiveButtonTitle
          }
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
  },
  buttonContainer: {
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
    backgroundColor: 'gray',
    height: '100%',
  },
  inactiveButton: {
    backgroundColor: 'white',
    height: '100%',
  },
  activeButtonTitle: {
    color: 'white',
  },
  inactiveButtonTitle: {
    color: 'black',
  },
});

export default ProgramListPage;
