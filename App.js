import React from 'react';
import { StyleSheet, View } from 'react-native';
import MainWindow from './components/MainWindow';


export default function App() {
  return (
      <View style={styles.container}>
        <MainWindow />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
