// VaultOperations.js

import immuDBInstance from '../api/ImmuDB';
import classRegistryInstance from '../logic/ClassRegistry';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import MainWindow from "../components/MainWindow"; // If you're using Expo

class VaultOperations {
// VaultOperations.js

    // Assuming navigation props are passed to your class in some way
    constructor(props) {
        // ... other initializations
        this.navigation = props.navigation; // This assumes you have passed navigation props to this class
    }

    generateSecureKey = (length = 32) => {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,-./:;<=>?@[]^_`{|}~";
        let randomCharacters = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomCharacters += charset[randomIndex];
        }
        return randomCharacters;
    };

    // Assuming that generateSecureKey and other relevant methods are already defined in this class

    async createNewVault(login, password) {
        // Validate input
        if (!login || !password) {
            Alert.alert('Error', 'Login and password fields must not be empty.');
            return;
        }

        // Check for existing vault
        const existingData = await immuDBInstance.getUserDataFromDatabase(login);
        if (existingData && existingData.revisions && existingData.revisions.length > 0) {
            Alert.alert('Error', 'A vault with this login already exists.');
            return;
        }

        // Generate a secure key
        const key = this.generateSecureKey();

        // Attempt to save the new vault
        const responseJson = await immuDBInstance.saveNewVault(login, password, key);

        // Handle the response
        if (!responseJson || !responseJson.documentId) {
            Alert.alert('Error', 'Failed to create a new vault.');
            return;
        }

        // Set the user ID in your state management system
        this.setUserId(responseJson.documentId); // Make sure to define setUserId

        // Save the key to a file
        const defaultFileName = `${login}_key.txt`;
        try {
            const fileUri = FileSystem.documentDirectory + defaultFileName;
            await FileSystem.writeAsStringAsync(fileUri, key);
            Alert.alert('Success', `Key saved to file: ${defaultFileName}`);
        } catch (error) {
            Alert.alert('Error', `Could not save the key to a file: ${error.message}`);
        }

        // Navigate to user table or next screen
        this.displayUserTable(); // Make sure to define displayUserTable
    }

    displayLoginScreen = () => {
        // Assuming 'LoginScreen' is the name of your login screen component
        this.navigation.navigate('MainWindow');
    }

    displayUserTable = async () => {
        console.log('displayUserTable2');
        // Assuming 'UserTableScreen' is the name of your user table screen component

        // Before navigating, you may want to load the data
        try {
            await immuDBInstance.loadTableFromDatabase();
            this.navigation.navigate('UserPasswordTable');
        } catch (error) {
            console.error('Failed to load table data:', error);
            // Handle error - maybe stay on the current screen and show an error message
        }
    }


    accessUserVault = async (login, password, keyFromFile) => {
        try {
            // Retrieve stored data for the given login
            const storedData = await immuDBInstance.getUserDataFromDatabase(login);
            console.log("Stored Data:", storedData);

            const revisions = storedData?.revisions || [];

            if (revisions.length === 0) {
                Alert.alert('Failure', 'No such vault exists.');
                return;
            }

            const firstRevision = revisions[0];
            const document = firstRevision.document || {};

            const loginFromDB = document.login;
            const passwordFromDB = document.password;
            const keyFromDB = document.key;

            if (loginFromDB === login && passwordFromDB === password && keyFromDB === keyFromFile) {
                // If login is successful, save the user ID and navigate to the user table
                // Assuming classRegistryInstance.setUserId is a method to save the user ID
                console.log(document._id);
                console.log(classRegistryInstance);
                classRegistryInstance.setUserId(document._id);
                console.log(classRegistryInstance);
                console.log("User id from data:", classRegistryInstance.getUserId());

                // Navigate to the user table
                // Assuming this method is defined elsewhere in your application
                this.displayUserTable();
            } else {
                Alert.alert('Failure', 'Failed to access the vault. Invalid credentials or key.');
            }
        } catch (error) {
            console.error(`An exception occurred: ${error}`);
            Alert.alert('Error', `An error occurred: ${error}`);
        }
    }

    readKeyFromFile = async () => {
        try {
            // Use a library like react-native-document-picker to select a file
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            // Then read the file's contents
            const keyFromFile = await RNFS.readFile(res.uri);

            // Now you can use this key to access the vault
            // You would get the login and password from your component's state or context
            this.accessUserVault(this.state.login, this.state.password, keyFromFile);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
            } else {
                console.error('Error reading key file:', err);
                Alert.alert('Error', 'An error occurred while reading the key file.');
            }
        }
    }
}



export default VaultOperations;