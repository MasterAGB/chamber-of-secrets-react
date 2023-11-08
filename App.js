import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


import MainWindow from './components/MainWindow';
import UserPasswordTable from './components/UserPasswordTable'; // Import other screens


const Stack = createNativeStackNavigator();


function App() {


    return (<SafeAreaProvider style={styles.safeAreaProvider}>
        <SafeAreaView style={styles.safeAreaView} edges={['right', 'bottom', 'left', 'top']}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false // This will hide the header globally for all screens
                    }}>
                    <Stack.Screen name="MainWindow" component={MainWindow} options={{headerShown: false}}/>
                    <Stack.Screen name="UserPasswordTable" component={UserPasswordTable}
                                  options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer></SafeAreaView></SafeAreaProvider>);
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1, backgroundColor: '#ccc',
    }, safeAreaProvider: {
        flex: 1, backgroundColor: '#aaa',
    },
});
export default App;

