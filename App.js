import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import MainWindow from './components/MainWindow';
import UserPasswordTable from './components/UserPasswordTable'; // Import other screens


const Stack = createNativeStackNavigator();




function App() {



    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="MainWindow" component={MainWindow} />
                <Stack.Screen name="UserPasswordTable" component={UserPasswordTable} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

